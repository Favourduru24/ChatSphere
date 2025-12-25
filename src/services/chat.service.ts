import { emitNewChatToParticpants } from "../lib/socket"
import ChatModel from "../models/chat.model"
import MessageModel from "../models/message.model"
import UserModel from "../models/user.model"

export const createChatService = async (
    userId: string,
    body: {
        participantId?: string | undefined,
        isGroup?: boolean | undefined,
        participants?: string[] | undefined,
        groupName?: string | undefined,
    }
) => {   
     const {participantId, participants, groupName, isGroup} = body

    let chat 
    let allParticipantIds: string[] = []

    if(isGroup && participants?.length && groupName) {
        allParticipantIds = [userId, ...participants]

        chat = await ChatModel.create({
           participants: allParticipantIds,
           isGroup: true,
           groupName,
           createdBy: userId
        })
    } else if(participantId) {
         const otherUser = await UserModel.findById(participantId)

         if(!otherUser) throw new Error("User Not Found!")

        allParticipantIds = [userId, participantId]

        const existingChat = await ChatModel.findOne({
             participants: {
                $all: allParticipantIds,
                $size: 2
             }
        }).populate("participants", "name avatar")

    if(existingChat) return existingChat

     chat = await ChatModel.create({
        participants: allParticipantIds,
        isGroup: false,
        createdBy: userId
     })

    }

    //implement web socket

    const populatedChat = await chat?.populate("participants", "name avatar")

    const participantIdStrings = populatedChat?.participants?.map((p) => {
        return p._id?.toString()
    })

    emitNewChatToParticpants(participantIdStrings, populatedChat)

    return chat
}

 export const getUserChatService = async (userId: string) => {
    const chat = await ChatModel.find({
         participants: { $in: [userId] }
    }).populate("participants", 'name avatar')
      .populate({
          path: "lastMessage",
          populate: {
            path: 'sender',
            select: "name avatar"
          }
      })
      .sort({updatedAt: -1})
      return chat
 }

 export const getSingleChatService = async (chatId: string, userId: string) => {
    const chat = await ChatModel.findOne({
        _id: chatId,
        participants: {
            $in: [userId]
        }
    }).populate('participants', 'name avatar')

    if(!chat) throw new Error('Chat not found or you are not authorized to view this chat!')

    const messages = await MessageModel.find({chatId})
    .populate("sender", "name avatar")
.populate({
          path: "replyTo",
          select: "content image sender",
          populate: {
             path: "sender",
             select: "name avatar"
          },
         }).sort({createdAt: 1})

         return {
            chat,
            messages
         }}

  export const validateChatParticipant = async (chatId: string, userId: string) => {

   const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
        $in: [userId]
    }
   })
    
   if(!chat) throw new Error('User not a participant in chat')

    return chat
  }