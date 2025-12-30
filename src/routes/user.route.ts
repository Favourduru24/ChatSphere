import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { getUsersController, updateUserProfile } from "../controllers/user.controller";

const userRoutes = Router()
.use(passportAuthenticateJwt)
.get('/all', getUsersController)
.put('/update/profile', updateUserProfile)


export default userRoutes