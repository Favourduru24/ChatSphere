import jwt from "jsonwebtoken"
import { HTTPSTATUS } from "../config/http.config"
import UserModel from "../models/user.model"
import { getGoogleClient } from "../utils/google.strategy"
import { ENV } from "../config/env.config"

 export const googleAuthCallbackHandlerService = async (code: string) => {

     const client = getGoogleClient()

     const {tokens} = await client.getToken(code)

     if(!tokens.id_token) {
        throw Object.assign(new Error("No google id_token is present"), {
        statusCode: HTTPSTATUS.BAD_REQUEST
        })
     }

     const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID as string
     })

     const payload = ticket.getPayload()

     const email = payload?.email
     const firstName = payload?.given_name
     const lastName = payload?.family_name
     const profile = payload?.picture
     const emailVerified = payload?.email_verified

     if(!email || !emailVerified) {
        throw Object.assign(new Error("Google email account is not verified."), {
        statusCode: HTTPSTATUS.BAD_REQUEST
        })
     }

     const normalizedEmail = email.toLocaleLowerCase().trim()

     let user = await UserModel.findOne({email: normalizedEmail})

     if(!user) {
         user = await UserModel.create({
            name: `${firstName + ' ' + lastName}`,
            email: normalizedEmail,
            avatar: profile,
            isOAuthUser: true
         })
     } 

     return user
 }