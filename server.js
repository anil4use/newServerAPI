import app from "./app.js";
import env from 'dotenv'
import cloudinary from 'cloudinary'
import { connetDB } from "./config/database.js";
import RazorPay from 'razorpay'
import nodecron from 'node-cron'
import { Stats } from "./models/stats.js";
env.config({path:"./config/config.env"});

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLINT_NAME,
    api_key:process.env.CLOUDINARY_CLINT_API,
    api_secret:process.env.CLOUDINARY_CLINT_SCERET,
})
export const instance = new RazorPay({
    key_id: process.env.RAZORPAY_PAYMET_KEY,
    key_secret: process.env.RAZORPAY_PAYMET_SCERET
  });


  nodecron.schedule("0 0 0 1 * *",async()=>{
    try {
       await Stats.create({})
    } catch (error) {
      console.log(error)  
    }
  });

const PORT =process.env.PORT||4000
app.listen(PORT,(req,res)=>{
    console.log(`server is workin on port ${PORT}`)
});
connetDB()