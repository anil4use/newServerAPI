import mongoose, { Schema } from "mongoose";
const UserSchema = new mongoose.Schema({
    comments:{
        type:String,
    }, 
    CreateAT: {
        type: Date,
        default: Date.now
    },
   

})
export const ExtraFN = mongoose.model("ExtraFN", UserSchema)