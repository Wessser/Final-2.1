import { timeStamp } from "console";
import mongoose from "mongoose";

//* Модель пользоователя

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    passwordHash:{
        type: String,
        required: true,
    },
    avatarUrl: String,
},{
    timeStamps: true,
},
);

export default mongoose.model('User', UserSchema);