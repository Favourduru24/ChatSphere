import "dotenv/config"
import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import http from "http"
import { ENV } from "./config/env.config"
import { asyncHandler } from "./middlewares/asyncHandler.middleware"
import { HTTPSTATUS } from "./config/http.config"
import { errorMiddleware } from "./middlewares/errorHandler.middleware"
import connectToDatabase from "./config/database.config"
import passport from "passport"
import "./config/passport.config"
import { initializeSocket } from "./lib/socket"
import routes from "./routes"

const app = express()
const server = http.createServer(app)

//socket
initializeSocket(server)

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin: ENV.FRONTEND_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "10mb"}))
app.use(passport.initialize())

app.get('/health', asyncHandler(async (req: Request, res: Response) => {
     res.status(HTTPSTATUS.OK).json({
        status: "OK",
        message: 'Server is healthy'
     }) 
}))
 
  app.use('/api', routes)
  app.use(errorMiddleware)

server.listen(ENV.PORT, async() => {
      await connectToDatabase()
     console.log(`Server running on port ${ENV.PORT}`)
})