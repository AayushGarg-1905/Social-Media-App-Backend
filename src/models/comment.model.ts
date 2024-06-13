import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        maxLength: 200,
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
