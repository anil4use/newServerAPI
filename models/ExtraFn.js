import mongoose, { Schema } from "mongoose";
const UserSchema = new mongoose.Schema({
    // comments:{
    //     type:String,
    //     required: [true, "Please enter comments"],

    // }, 
    // CreateAT: {
    //     type: Date,
    //     default: Date.now
    // },

    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    text: String,
    timestamp: { type: Date, default: Date.now }
    // courseId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Course",
    //     required: true,
    //   },
    //   lectureId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Course.lectures",
    //     required: true,
    //   },
    //   userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Users",
    //     required: true,
    //   },
    //   text: {
    //     type: String,
    //     required: true,
    //   },
    //   timestamp: {
    //     type: Date,
    //     default: Date.now,
    //   },
});


export const ExtraFN = mongoose.model("ExtraFN", UserSchema)