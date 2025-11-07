import { HTTPSTATUS } from "../config/http.config";
import { Response } from "express";
import UserModel from "../models/user.model";
import { LoginSchemaType, RegisterSchemaType } from "../validators/auth.validator";
import { compareValue, hashValue } from "../utils/bcrypt";

export const registerService = async (body: RegisterSchemaType, res: Response) => {

    const {email, password} = body
    
    const existingUser = await UserModel.findOne({email})

    if(existingUser) return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'User already exist',
        success: false
    })

    const hashPassword = await hashValue(password, 10)

    const newUser = await UserModel.create({
        ...body,
        password: hashPassword
    })

     return newUser
}

export const loginService = async (body: LoginSchemaType, res: Response) => {

    const {email, password} = body
     
    const user = await UserModel.findOne({email})

    if(!user) return res.status(HTTPSTATUS.NOT_FOUND).json({
        message: 'Email not found!',
        success: false
    })

    const isPasswordValid = await compareValue(user.password, password)
      
   if(!isPasswordValid) return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Unauthorized Invalid password',
        success: false
    })

    return user
}