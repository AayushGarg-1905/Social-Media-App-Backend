import mongoose from "mongoose";

export enum Gender {
    male = "MALE",
    female = "FEMALE"
}

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        maxLength: 40,
        required: true
    },
    email: {
        type: String,
        maxLength: 40,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    passwordSalt: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        maxLength: 10,
    },
    address: {
        type: String,
        minLength: 10,
        maxLength: 40,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: []
    }
}, { timestamps: true })


// export const UserModel =  mongoose.model('User', UserSchema);
export default mongoose.model('User',UserSchema);
