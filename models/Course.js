import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter course tittle"],
        // minLength: [4, "tittle must be at least 4 characters"],
        mexLength: [80, "tittle can't exceed 80 characters "],
    },
    descripaton: {
        type: String,
        required: [true, "Please enter course tittle"],
        // minLength: [20, "tittle must be at least 4 characters"],
    },
    lectures: [{
        title: {
            type: String,
            required: true
        },
        descripaton: {
            type: String,
            required: true
        },
        video: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        },
    }],

    poster: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    views: {
        type: Number,
        default: 0,
    },
    NumberofVideos: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    createBY: {
        type: String,
        required: [true, "Enter Couser Creator Name"]
    },
    CreateAT: {
        type: Date,
        default: Date.now
    },



})
export const Course = mongoose.model("Course", CourseSchema)