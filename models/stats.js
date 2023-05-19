import mongoose, { Schema } from "mongoose";
const UserSchema = new mongoose.Schema({
    users:{
        type:Number,
        default:0,
    }, 
    subscription:{
        type:Number,
        default:0,
    }, 
    views:{
        type:Number,
        default:0,
    }, 
    creatredAt: {
        type: Date,
        defult: Date.now
    },
   

})
export const Stats = mongoose.model("Stats", UserSchema)