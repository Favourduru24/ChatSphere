import { Request, Response } from "express";
import { getGoogleClient } from "../utils/google.strategy";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { googleAuthCallbackHandlerService } from "../services/oauth.service";
import { setJwtAuthCookie } from "../utils/cookie";

export const googleAuthStartController = asyncHandler(async (req: Request, res: Response) => {

    const client = getGoogleClient()

    const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["openid", "email", "profile"]
    })

    return res.redirect(url)
})

export const googleAuthCallbackController = asyncHandler (async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined

    if(!code) {
        return res.status(400).json({
            message: 'Missing code in callback'
        })
    }

     const user = await googleAuthCallbackHandlerService(code)

     const userId = user._id as string

     return setJwtAuthCookie({
             res,
             userId
         }).status(HTTPSTATUS.OK).json({
              message: 'User login successfully!',
              user
         })
    })

