import mongoose, { Schema } from "mongoose";
const UserSchema = new mongoose.Schema({
    razorpay_signature:{
        type:String,
        required:true,
    }, razorpay_subscription_id:{
        type:String,
        required:true,
    }, razorpay_payment_id:{
        type:String,
        required:true,
    },
    creatredAt: {
        type: Date,
        defult: Date.now
    },
   

})
export const Payment = mongoose.model("Payment", UserSchema)