import mongoose from "mongoose";
import { Schema } from "mongoose";

export const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        maxLength: 200,
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required:true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        required: true,
    },

}, { timestamps: true })


export default mongoose.model('Comment',CommentSchema);
