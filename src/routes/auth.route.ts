import {Router} from "express"
import { authStatusController, loginController, logoutController, registerController } from "../controllers/auth.controller"
import { passportAuthenticateJwt } from "../config/passport.config"
import { googleAuthCallbackController, googleAuthStartController } from "../controllers/oauth.controller"

const authRoutes = Router()
.post('/register', registerController)
.post('/login', loginController)
.post('/logout', logoutController)
.get('/status', passportAuthenticateJwt, authStatusController)
.get('/google', googleAuthStartController)
.get('/google/callback', googleAuthCallbackController)

export default authRoutes