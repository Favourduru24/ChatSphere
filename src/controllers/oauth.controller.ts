import { Request, Response } from "express";
import { getGoogleClient } from "../utils/google.strategy";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { googleAuthCallbackHandlerService } from "../services/oauth.service";
import {setJwtAuthCookie } from "../utils/cookie";
import { ENV } from "../config/env.config";

export const googleAuthStartController = asyncHandler(async (req: Request, res: Response) => {

    const client = getGoogleClient()

    const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["openid", "email", "profile"]
    })

    return res.redirect(url)
})

export const googleAuthCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;

    if (!code) {
      return res.status(400).json({ message: "Missing code in callback" });
    }

    const user = await googleAuthCallbackHandlerService(code);

    // Generate JWT
    setJwtAuthCookie({
      res,
      userId: user._id as string,
    });
    // Redirect to frontend with token in URL
    return res.redirect(`${ENV.FRONTEND_ORIGIN}/chat`);
  }
);
