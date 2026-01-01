 import "dotenv/config"
 import UserModel from "../models/user.model"
 import connectToDatabase from "../config/database.config"

 export const CreateChatsphereAI = async () => {

     let chatSphereAI = await UserModel.findOne({isAI: true})

     if(chatSphereAI) {
         console.log('Whool AI already exists')
         return chatSphereAI
     }

     chatSphereAI = await UserModel.create({
        name: 'chatSphere AI',
        isAI: true,
        avatar: 'https://res.cloudinary.com/dtbh8wrrb/image/upload/v1767121461/chatsphereAI_tntayi.png',
     })

     console.log('Chatsphere Ai created', chatSphereAI._id)
     return chatSphereAI
 }

  const seedChatsphereAI = async () => {
     try {
      await connectToDatabase()
      await CreateChatsphereAI()
      console.log('Seeding completed')  
      process.exit(0)
     } catch (error) {
        console.log('Seeding failed', error)
        process.exit(1)
     }
  }

  seedChatsphereAI()