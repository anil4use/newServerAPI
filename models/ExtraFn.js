import mongoose, { Schema } from "mongoose";
const UserSchema = new mongoose.Schema({
    comments:{
        type:String,
        required: [true, "Please enter commets"],

    }, 
    CreateAT: {
        type: Date,
        default: Date.now
    },
   

})
export const ExtraFN = mongoose.model("ExtraFN", UserSchema)