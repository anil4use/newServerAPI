import mongoose from "mongoose";
export const connetDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conneted`)
}