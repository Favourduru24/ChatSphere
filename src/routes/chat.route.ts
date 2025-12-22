import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { createChatController, getSingleChatController, getUserChatController } from "../controllers/chat.controller";
import { sendMessageController } from "../controllers/message.controller";


const chatRoutes = Router()
// .use(passportAuthenticateJwt)
.post('/create', createChatController)
.get('/all', passportAuthenticateJwt, getUserChatController)
.post("/send/message", sendMessageController)
.get('/:id', getSingleChatController)


export default chatRoutes