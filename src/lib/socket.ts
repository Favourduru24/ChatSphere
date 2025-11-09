import { Server as HTTPServer } from "http"
import { Server, type Socket} from "socket.io"
import { ENV } from "../config/env.config"
import jwt from "jsonwebtoken"
import { validateChatParticipant } from "../services/chat.service"

 interface AuthenticatedSocket extends Socket{
    userId?: string
 }

 let io: Server | null = null

 const onlineUsers = new Map<string, string>()

export const initializeSocket = (httpServer: HTTPServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: ENV.FRONTEND_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    io.use(async (socket: AuthenticatedSocket, next) => {
       try {
         const rawCookies = socket.handshake.headers.cookie

         if(!rawCookies) return next(new Error('Unauthorized!'))
            
            const token = rawCookies?.split("=")?.[1]?.trim()

        if(!token) return next(new Error('Unauthorized!'))

         const decodedToken = jwt.verify(token, ENV.JWT_SECRET) as {
            userId: string
         }

           if(!decodedToken) return next(new Error('Unauthorized!'))

        socket.userId = decodedToken.userId
        next()
       } catch (error) {
         next(new Error('Internal server error'))
       }
    })

     io.on("connection", (socket: AuthenticatedSocket) => {

        if(!socket.userId){
         socket.disconnect(true)
         return
        }

       const userId = socket.userId!
       const newSocketId = socket.id

       console.log('socket connected', {userId, newSocketId})

       onlineUsers.set(userId, newSocketId)

       io?.emit("online:users", Array.from(onlineUsers.keys()))
        
         //create personnal room for user
        socket.join(`user:${userId}`)

        socket.on("chat:join", async (chatId: string, callback?:(err?: string) => void) => {
            try {
                 await validateChatParticipant(chatId, userId)

                 socket.join(`chat:${chatId}`)
                 callback?.()
            } catch (error) {
                callback?.('Error joining chat')
            }
        })
    
         socket.on("chat:leave", (chatId: string) => {
             if(chatId) {
                 socket.leave(`chat:${chatId}`)
                 console.log(`User ${userId} left room chat:${chatId}`)
             }
         })
        
        socket.on('disconnect', () => {
             if(onlineUsers.get(userId) === newSocketId) {
                if(userId) onlineUsers.delete(userId)

          io?.emit("online:users", Array.from(onlineUsers.keys()))

           console.log("socket disconnected", {
            userId,
            newSocketId,
           })
             }
        })
     })
}
     function getIO () {
         if(!io) throw new Error("Sockt.IO not initialized")
      return io
     }
    export const emitNewChatToParticipant = (participantIds: string[] = [], chat: any) => {
      const io = getIO()
      for (const participantId of participantIds) {
         io.to(`user:${participantId}`).emit("chat:new", chat)
      } 
    }