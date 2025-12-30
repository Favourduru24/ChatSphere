 import { Request, Response } from "express";
 import { asyncHandler } from "../middlewares/asyncHandler.middleware";
 import { HTTPSTATUS } from "../config/http.config";
import { getUsersService, updateUserProfileService } from "../services/user.service";
import { updateUserAvatarSchema } from "../validators/auth.validator";

 export const getUsersController = asyncHandler(
    async (req: Request, res: Response) => {
         const userId = req.user?._id
          
          const users = await getUsersService(userId)

         return res.status(HTTPSTATUS.OK).json({
            message: 'Users retrived successfully!',
            users
         })
    }
 )

 export const updateUserProfile = asyncHandler(
    async (req: Request, res: Response) => {
       const userId = req.user?._id

       const body = updateUserAvatarSchema.parse(req.body)

       const user = await updateUserProfileService(userId, body)

       return res.status(HTTPSTATUS.OK).json({
          message: 'User profile updated successfully!',
          user
       })
    }
 )