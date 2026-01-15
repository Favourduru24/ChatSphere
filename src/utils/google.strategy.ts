import { OAuth2Client } from "google-auth-library"

export const getGoogleClient = () => {
   const clientId = process.env.GOOGLE_CLIENT_ID!
   const clientSecret = process.env.GOOGLE_SECRET!
   const redirectUri = process.env.GOOGLE_CALLBACK_URL

   if(!clientId || !clientSecret) {
    throw new Error('Google client id and secret both are missing!')
   }

   return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri
   }) 
}