import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter course title"],
    maxLength: [80, "Title can't exceed 80 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter course description"],
  },
  lectures: [
    {
      title: {
        type: String,
        required: true,
      },
      comments: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
          username: { type: String, ref: "Users", field: "name" },
          useravatar: { type: String, ref: "Users", field: "avatar" },
          text: {
            type: String,
            required: [true, "Please enter comments"],
          },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      description: {
        type: String,
        required: true,
      },
      video: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        views: {
          type: Number,
          default: 0,
        },
      },
    },
  ],
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  numberOfVideos: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: [true, "Enter Course Creator Name"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CourseSchema.methods.incrementViews = async function (lectureIndex) {
  try {
    if (lectureIndex >= 0 && lectureIndex < this.lectures.length) {
      this.lectures[lectureIndex].video.views += 1;
      await this.save();
    } else {
      throw new Error("Invalid lecture index");
    }
  } catch (error) {
    throw new Error("Failed to increment views count");
  }
};

export const Course = mongoose.model("Course", CourseSchema);
