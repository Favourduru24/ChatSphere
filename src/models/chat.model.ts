import mongoose,{Schema, Document} from "mongoose";

    export interface ChatDocument extends Document {
     participants: mongoose.Types.ObjectId[],
     lastMessage: mongoose.Types.ObjectId,
     isGroup: boolean,
     groupName: string,
     groupAvatar?: string | null,
     createdBy: mongoose.Types.ObjectId,
     createdAt: Date,
     updatedAt: Date
    }

    const chatSchema = new Schema<ChatDocument>({
        participants: [ { type: Schema.Types.ObjectId, ref: 'User', required: true}],
        lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null},
        isGroup: {type: Boolean, default: false},
        groupName: {type: String},// required: true,
        groupAvatar: {type: String, default: null},
        createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    }, {
         timestamps: true
    })

    const ChatModel = mongoose.model<ChatDocument>('Chat', chatSchema)

    export default ChatModel