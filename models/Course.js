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
        
        ///// comments system add 
        comments: [
            {
              userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
              username: { type: String, ref: 'Users', field: 'name' },
              useravatar: { type: String, ref: 'Users', field: 'avatar' },
              text: {
                type:String,
                required: [true, "Please enter comments"],
                        // minLength: [4, "tittle must be at least 4 characters"],
                        // mexLength: [40, "tittle can't exceed 80 characters 40 "],


            },
              timestamp: { type: Date, default: Date.now },
            },
          ]
,
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