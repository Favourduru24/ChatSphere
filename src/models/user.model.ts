import mongoose, {Document, Schema} from "mongoose"

export interface UserDocument extends Document {
    name: string,
    email: string,
    password: string,
    avatar?: string | null,
    createdAt: Date,
    updatedAt: Date
}

 const userSchema = new Schema<UserDocument>({
     name: {type: String, required: true},
     email: {type: String, unique: true, required: true, trim: true, lowercase: true},
     password: {type: String, default: null, select: false},
     avatar: {type: String, default: null}
 },{
    timestamps: true,
 })


const UserModel = mongoose.model<UserDocument>('User', userSchema)
export default UserModel
