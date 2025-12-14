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


// {
//   "name": "Duru Pristine",
//   "email":"durupristine@gmail.com",
//   "password":"guardianp40",
//   "id1": "6938f675c486d7352f0fd7e3",
//   "id3": "693e0f6cb328ffcb12831bae"
//   "id2": "6938f28cc486d7352f0fd7d9"
// }

// {
//   "participantId": "6938f675c486d7352f0fd7e3",
//   "isGroup": false
// }


// {
//   "participants": ["6938f675c486d7352f0fd7e3", "693e0f6cb328ffcb12831bae"],
//   "isGroup": true,
//   "groupName": "Dev Group",
//   "userId":"6938f28cc486d7352f0fd7d9"
// }

