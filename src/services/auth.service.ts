import { HTTPSTATUS } from "../config/http.config";
import { Response } from "express";
import UserModel, { UserDocument } from "../models/user.model";
import { LoginSchemaType, RegisterSchemaType } from "../validators/auth.validator";
import { compareValue, hashValue } from "../utils/bcrypt";

export const registerService = async (body: RegisterSchemaType): Promise<UserDocument> => {
  const { email, password } = body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw Object.assign(new Error("User already exists"), { statusCode: HTTPSTATUS.BAD_REQUEST });
  }

  const hashedPassword = await hashValue(password, 10);

  const newUser = new UserModel({
    ...body,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
};

export const loginService = async (body: LoginSchemaType) : Promise<UserDocument> => {

    const {email, password} = body
     
    const user = await UserModel.findOne({email}).select('-password')

    if (!user) {
    throw Object.assign(new Error("Email not found!"), { statusCode: HTTPSTATUS.NOT_FOUND });
  }

      
    const isPasswordValid = await compareValue(password, user.password);
    
  if (!isPasswordValid) {
    throw Object.assign(new Error("Invalid password!"), { statusCode: HTTPSTATUS.BAD_REQUEST });
  }

  return user;
}