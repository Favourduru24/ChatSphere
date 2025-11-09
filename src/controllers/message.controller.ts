import { Response, Request } from "express";
import { createChatSchema } from "../validators/chat.validator";
import { sendMessageSchema } from "../validators/message.validator";
import { HTTPSTATUS } from "../config/http.config";
import { sendMessageService } from "../services/message.service";

export const sendMessageController = async (req: Request, res:Response) => {
  const userId = req.user?._id
  const body = sendMessageSchema.parse(req.body)

  const result = await sendMessageService(userId, body, req)

  return res.status(HTTPSTATUS.OK).json({
    message: 'Message sent successfully!',
    ...result
  })

}