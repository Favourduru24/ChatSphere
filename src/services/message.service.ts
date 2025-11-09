import { Request, Response } from "express"
import ChatModel from "../models/chat.model"
import MessageModel from "../models/message.model"
import cloudinary from "../config/cloudinary.config"

export const sendMessageService = async (userId: string, res: Response, body:{
     chatId?: string,
     content?: string,
     image?: string,
     replyToId: string
}, ) => {

      const {chatId, content, image, replyToId} = body

      const chat = await ChatModel.findOne({
        _id: chatId,
        participants: {
            $in: [userId]
        }
      })
      
      if(!chat) throw new Error("Chat not found or unauthorized")

    if(replyToId) {
         const replyMessage = await MessageModel.findOne({
            _id: replyToId,
            chatId
         })

         if(!replyMessage) return res.status(400).json({
            message: 'Reply message not found'
         })
        }
         let imageUrl 

         if(image) {
          const uploadRes = await cloudinary.uploader.upload(image)
          imageUrl = uploadRes.secure_url
        }
        const newMessage = await MessageModel.create({
         chatId,
         sender: userId,
         content,
         image: imageUrl,
         replyTo: replyToId || null
        })

        await newMessage.populate([
            {path: "sender", select: "name avatar"},
            {path: "replyTo", select: "content image sender", populate: {
                 path: "sender", select: "name avatar" 
            }}
        ])

         
        return {userMessage: newMessage, chat} 
    }
