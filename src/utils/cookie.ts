import jwt from "jsonwebtoken"
import { ENV } from "../config/env.config"
import { Response } from "express"

type Time = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`
type Cookie = {
    res: Response,
    userId: string
}

export const setJwtAuthCookie = ({res, userId}: Cookie) => {

  const payload = {userId}
  const expiresIn = ENV.JWT_EXPIRE_IN as Time

  const token = jwt.sign(payload, ENV.JWT_SECRET, {
     audience: ["user"],
     expiresIn: expiresIn || "7d"
  })

   return res.cookie("accessToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production' ? true : false,
    sameSite: ENV.NODE_ENV === 'production' ? true : false
   })
}

export const clearJwtAuthCookie = (res: Response) => 
    res.clearCookie('accessToken', {path: '/'})
