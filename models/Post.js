import { timeStamp } from "console";
import mongoose from "mongoose";

//* Модель поста

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    text:{
        type: String,
        required: true,
        unique:true,
    },
    tags:{
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    imageUrl: String,
},
{
    timeStamps: true,
},
);

export default mongoose.model('Post', PostSchema);