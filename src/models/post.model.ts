import mongoose from "mongoose";
import { Schema } from "mongoose";

const PostSchema = new mongoose.Schema({
    caption: {
        type: String,
        maxLength: 200,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required:true,
    },
    userName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
}, { timestamps: true })


export default mongoose.model('Post',PostSchema);
