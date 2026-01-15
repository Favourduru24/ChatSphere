import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { Server, type Socket } from "socket.io";
import { ENV } from "../config/env.config";
import { validateChatParticipant } from "../services/chat.service";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

type OnlineUser = {
  userId: string;
  socketId: string;
};

let io: Server | null = null;

// ARRAY-BASED ONLINE USERS
const onlineUsers: OnlineUser[] = [];

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.FRONTEND_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
        if (!rawCookie) return next(new Error("Unauthorized"));

        const cookies = rawCookie
  .split(";")
  .map((cookie) => cookie.trim())
  .reduce<Record<string, string>>((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});

      const token = cookies.accessToken;
      if (!token) return next(new Error("Unauthorized"));


      const decodedToken = jwt.verify(token, ENV.JWT_SECRET) as {
        userId: string;
      };


      socket.userId = decodedToken.userId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    if (!socket.userId) {
      socket.disconnect(true);
      return;
    }

    const userId = socket.userId;
    const socketId = socket.id;

    // 🔹 REMOVE EXISTING SOCKET FOR USER (single-session logic)
    const existingIndex = onlineUsers.findIndex(
      (u) => u.userId === userId
    );

    if (existingIndex !== -1) {
      onlineUsers.splice(existingIndex, 1);
    }

    // 🔹 ADD USER
    onlineUsers.push({ userId, socketId });

    // 🔹 BROADCAST ONLINE USERS
    io?.emit(
      "online:users",
      onlineUsers.map((u) => u.userId)
    );

    // 🔹 PERSONAL ROOM
    socket.join(`user:${userId}`);

    socket.on(
      "chat:join",
      async (chatId: string, callback?: (err?: string) => void) => {
        try {
          await validateChatParticipant(chatId, userId);
          socket.join(`chat:${chatId}`);
          callback?.();
        } catch {
          callback?.("Error joining chat");
        }
      }
    );

    socket.on("chat:leave", (chatId: string) => {
      if (chatId) {
        socket.leave(`chat:${chatId}`);
      }
    });

    socket.on("disconnect", () => {
      const index = onlineUsers.findIndex(
        (u) => u.userId === userId && u.socketId === socketId
      );

      if (index !== -1) {
        onlineUsers.splice(index, 1);

        io?.emit(
          "online:users",
          onlineUsers.map((u) => u.userId)
        );

        console.log("socket disconnected", {
          userId,
          socketId,
        });
      }
    });
  });
};

function getIO() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}

// ========================= EMITTERS =========================

export const emitNewChatToParticpants = (
  participantIds: string[] = [],
  chat: any
) => {
  const io = getIO();
  for (const participantId of participantIds) {
    io.to(`user:${participantId}`).emit("chat:new", chat);
  }
};

export const emitNewMessageToChatRoom = (
  senderId: string,
  chatId: string,
  message: any
) => {
  const io = getIO();

  const sender = onlineUsers.find(
    (u) => u.userId === senderId
  );

  const senderSocketId = sender?.socketId;

  
  if (senderSocketId) {
    io
      .to(`chat:${chatId}`)
      .except(senderSocketId)
      .emit("message:new", message);
  } else {
    io.to(`chat:${chatId}`).emit("message:new", message);
  }
};

export const emitLastMessageToParticipants = (
  participantIds: string[],
  chatId: string,
  lastMessage: any
) => {
  const io = getIO();
  const payload = { chatId, lastMessage };

  for (const participantId of participantIds) {
    io.to(`user:${participantId}`).emit("chat:update", payload);
  }
};


export const emitChatAI = ({
  chatId,
  chunk = null,
  sender,
  done = false,
  message = null
}: {
   chatId: string
   chunk?: string | null
   sender?: any
   done?: boolean,
   message?: any
}) => {
    const io = getIO()

    if(chunk?.trim() && !done) {
       io.to(`chat:${chatId}`).emit('chat:ai', {
        chatId,
        chunk,
        done,
        message: null,
        sender,
       })
       return
    }

     if(done) {
       io.to(`chat:${chatId}`).emit('chat:ai', {
        chatId,
        chunk: null,
        done,
        message,
        sender,
       })
       return
    }
}