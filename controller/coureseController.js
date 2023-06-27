import ErrorHandler from '../middlewares/Error.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import { Course } from '../models/Course.js'
import { Stats } from '../models/stats.js';
import getDataUri from '../utils/dataUri.js';
import cloudinary from 'cloudinary'




//get all courses without lectures
export const getAllCourses = catchAsyncError(async (req, res, next) => {

    const keyword = req.query.keyword || ""//means to search a anyting by keyword
    const category = req.query.category || ""
    const courses = await Course.find({
        title: {
            $regex: keyword,
            $options: "i"
        },
        category: {
            $regex: category,
            $options: "i"
        }
    }).select("-lectures");

    res.status(201).json({
        succuss: true,
        courses,
    })
});


// add a course ---- only admin
export const CreateCouse = catchAsyncError(async (req, res, next) => {

    const { title, descripaton, category, createBY } = req.body;
    if (!title || !descripaton || !category || !createBY)
        return next(new ErrorHandler("Please add all fields ", 400));
    //   return  res.status(401).json({
    //         succuss: false,
    //         message: "add all filds"
    //     });
    const file = req.file;
    // console.log(file)
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    await Course.create({
        title,
        descripaton,
        category,
        createBY,
        poster: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        },
    });
    res.status(201).json({
        succuss: true,
        message: "Courese Ceateed Succesfully"
    })
});

/// get course letcture
export const getCourseLecture = catchAsyncError(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new ErrorHandler("Course not found ", 404));
    course.views += 1;
    course.save()
    res.status(201).json({
        succuss: true,
        lectures: course.lectures,
    })
});
//add lectures
export const addLecture = catchAsyncError(async (req, res, next) => {
    const { title, descripaton } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return next(new ErrorHandler("Course not found ", 404));

    // upload file here
    const file = req.file;
    // console.log(file)
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        resource_type: "video"
    });

    course.lectures.push({
        title,
        descripaton,
        video: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url
        }
    });
    course.numberOfVideos = course.lectures.length;
    course.save()
    res.status(201).json({
        succuss: true,
        massage: "lecture addes succussfully"
    })
});

////delete courese
export const deleteCourese = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return next(new ErrorHandler("Course not found ", 404));
    //  console.log(course)

    await cloudinary.v2.uploader.destroy(course.poster.public_id);
    for (let i = 0; i < course.lectures.length; i++) {
        const singlectutre = course.lectures[i];
        await cloudinary.v2.uploader.destroy(singlectutre.video.public_id, {
            resource_type: "video"
        });
    };

    await course.deleteOne();

    res.status(201).json({
        succuss: true,
        massage: "Course delete succusfully"
    })
});
////delete lecture
export const deleteLecture = async (req, res, next) => {
    const { courseId, lecturesId } = req.query;
    const course = await Course.findById(courseId);
    if (!course) return next(new ErrorHandler("Course not found ", 404));

    const lecture = course.lectures.find((item) => {
        if (item._id.toString() === lecturesId.toString()) return item;

    });
    await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
        resource_type: "video"
    });
    course.lectures = course.lectures.filter((item) => {
        if (item._id.toString() !== lecturesId.toString()) return item;

    })
    course.numberOfVideos = course.lectures.length;
    course.save()
    res.status(201).json({
        succuss: true,
        massage: "lecture delete succusfully"
    })
};

Course.watch().on("change", async () => {
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);
    const courses = await Course.find({});
    let totalViews = 0;

    for (let i = 0; i < courses.length; i++) {
        const lectures = courses[i].lectures;
        for (let j = 0; j < lectures.length; j++) {
            totalViews += lectures[j].video.views;
        }
    }

    stats[0].views = totalViews;
    stats[0].creatredAt = new Date(Date.now());
    await stats[0].save();

})