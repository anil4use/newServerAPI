import mongoose, { Schema } from "mongoose";
const UserSchema = new mongoose.Schema({
    comments:{
        type:String,
    }, 
    creatredAt: {
        type: Date,
        defult: Date.now
    },
   

})
export const ExtraFN = mongoose.model("ExtraFN", UserSchema)