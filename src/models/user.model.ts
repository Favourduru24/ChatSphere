import mongoose, {Document, Schema} from "mongoose"

export interface UserDocument extends Document {
    name: string,
    email?: string,
    password?: string,
    isAI: boolean,
    isOAuthUser: boolean,
    avatar?: string | null,
    createdAt: Date,
    updatedAt: Date
}

 const userSchema = new Schema<UserDocument>({
     name: {type: String, required: true},
     email: {type: String, unique: true, required: function(this: UserDocument) {
        return !this.isAI
     }, trim: true, lowercase: true},
     password: {
      type: String,
      default: null,
      required: function (this: UserDocument) {
        return !this.isAI && !this.isOAuthUser
      }
    },
     avatar: {type: String, default: null},
     isAI: {type: Boolean, default: false},
     isOAuthUser: {type: Boolean, default: false}
 },{
    timestamps: true,
 })


const UserModel = mongoose.model<UserDocument>('User', userSchema)
export default UserModel
