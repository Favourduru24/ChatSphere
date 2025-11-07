import mongoose from "mongoose"
import { ENV } from "./env.config"

const connectToDatabase = async () => {
      if(!ENV.MONGO_URL){
          throw new Error('Missing MONGODB_URL')
      }

    try {
       await mongoose.connect(ENV.MONGO_URL)
       console.log('Database connected successfully!')
    } catch (error) {
     console.log('Database connection error', error)
     process.exit(1)   
    }
}

export default connectToDatabase;