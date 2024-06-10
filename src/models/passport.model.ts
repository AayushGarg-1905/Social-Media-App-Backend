import mongoose from "mongoose";
import { Schema } from "mongoose";

const PassportSchema = new mongoose.Schema({
    userId:{
        // type: Schema.Types.ObjectId,
        type: Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    accessToken:{
        type:String,
        required:true,
        unique:true,
    },
    email: {
        type: String,
        maxLength: 40,
        required: true,
        unique: true
    },
    
}, { timestamps: true })


export default mongoose.model('Passport',PassportSchema);
