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
        type: [Schema.Types.ObjectId],
        default: []
    },
    comments: {
        type: [Schema.Types.ObjectId],
        default: []
    }
}, { timestamps: true })


export default mongoose.model('Post',PostSchema);
