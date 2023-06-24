import ErrorHandler from "../middlewares/Error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import { Course } from "../models/Course.js";
import { Users } from "../models/User.js"
import { SendToken } from "../utils/SendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import cloudinary from "cloudinary"
import getDataUri from '../utils/dataUri.js';
import crypto from 'crypto'
import { Stats } from "../models/stats.js";
import { ExtraFN } from "../models/ExtraFn.js";


//// User regsiter
export const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const file = req.file;
    if (!name || !email || !password || !file) {
        return next(new ErrorHandler("Please add all fields ", 400));
    };
    const users = await Users.findOne({ email });
    if (users) return next(new ErrorHandler("User alredy exit", 409));

    // console.log(file)
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    const user = await Users.create({
        name,
        email,
        password,
        avatar: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url
        }
    });
    SendToken(res, user, "registred Succusfully", 201)

    res.status(201).json({
        succuss: true,
        message: "register succussfully"
    })
});


//// user login
export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // const file = req.file
    if (!email || !password) {
        return next(new ErrorHandler("Please add all fields ", 400));
    };
    const users = await Users.findOne({ email }).select("+password");
    if (!users) return next(new ErrorHandler("User does't exit", 401));
    const isMatch = await users.comparePassword(password);
    if (!isMatch) return next(new ErrorHandler("incorrect Email Password", 401));
    SendToken(res, users, `welcome back ${users.name}`, 200)
});

/// logout 
export const logoutUser = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).json({
        succus: true,
        message: "logout succusfully"
    })
});

//get my profile
export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    res.status(201).json({
        succuss: true,
        user,
    })
});
//delete my profile
export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    if (!user) return next(new ErrorHandler("user not availble", 404));
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.deleteOne()
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
    }).json({
        succus: true,
        message: "logout succusfully"
    })
});

/// change password
export const changePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please add all fields ", 400));
    };
    const user = await Users.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
        return next(new ErrorHandler("incorrect old password", 400));
    };
    user.password = newPassword;
    await user.save()
    res.status(201).json({
        succuss: true,
        message: "passowrd change succussully"
    })
});
///update profile
// export const updateProfile = catchAsyncError(async (req, res, next) => {
//     const { email } = req.body;
//     // if (!email) {
//     //     return next(new ErrorHandler("Please add all fields ", 400));
//     // };
//     const user = await Users.findById(req.user._id);
//     // if (name) user.name = name;
//     if (email) user.email = email;
//     await user.save()
//     res.status(201).json({
//         succuss: true,
//         message: "Profile updated succussfully"
//     })
// });
///update profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return next(new ErrorHandler("Please add all fields ", 400));
    };
    const user = await Users.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save()
    res.status(201).json({
        succuss: true,
        message: "Profile updated succussfully"
    })
});

///update profile picture
export const updateprofilepicture = catchAsyncError(async (req, res, next) => {
    const file = req.file;
    const user = await Users.findById(req.user._id);

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
    };
    await user.save();
    res.status(201).json({
        succuss: true,
        message: "Profile Picture updated succussfully"
    })
});

//forgete password
export const forgetpassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) return next(new ErrorHandler("User not found ", 400));
    const resetToken = await user.getResteToken();
    await user.save()
    //send email via 
    const url = `${process.env.FRONTEND_URL}/resetepassword/${resetToken}`
    const massage = `click on the link to reset Your password.${url}.if 
   you have not request then please ignore`
    await sendEmail(user.email, "CourseBundler Resete Password", massage)
    res.status(201).json({
        succuss: true,
        message: `Resete token has been sent to ${user.email}`
    })
});
// resetpassword
export const resetepassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256")
        .update(token).digest("hex");
    const user = await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        }
    });
    if (!user) return next(new ErrorHandler("token is invalid or has been expired ", 400));
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    res.status(201).json({
        succuss: true,
        message: "password change succussfully",

    })
});
/// addTo PlayList
export const addToPlayLinst = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    const course = await Course.findById(req.body.id);
    if (!course) return next(new ErrorHandler("invalid course id", 404));
    const itemExit = user.playlist.find((item) => {
        if (item.course.toString() === course._id.toString()) return true
    })
    if (itemExit) return next(new ErrorHandler("Item elredy exit", 409));
    user.playlist.push({
        course: course._id,
        poster: course.poster.url,
    })
    await user.save()
    res.status(201).json({
        succuss: true,
        message: "added to playlist"
    })
});
//// remove from playlist
export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    const course = await Course.findById(req.query.id);
    if (!course) return next(new ErrorHandler("invalid course id", 404));

    const newPlaylist = user.playlist.filter((item) => {
        if (item.course.toString == !course._id.toJSON()) return item
    })
    user.playlist = newPlaylist;
    await user.save()
    res.status(201).json({
        succuss: true,
        message: "remove from playlist"
    })
});

///update users Role
export const updateUserRole = async (req, res, next) => {
    const user = await Users.findById(req.params.id);
    if (!user) return next(new ErrorHandler("user not availble", 404));
    if (user.role === "user") user.role = "admin"
    else (user.role == "user")
    await user.save()
    res.status(201).json({
        succuss: true,
        message: "Role updated succssfully",
    })
};
///delete users only admin
export const deleteMyprofile = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.params.id);
    if (!user) return next(new ErrorHandler("user not availble", 404));
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.deleteOne()
    res.status(201).json({
        succuss: true,
        message: "user delete succssfully",
    })
});


Users.watch().on("change", async () => {
    const stats = await Stats.find({}).sort({ CreateAT: "desc" }).limit(1);
    const subscription = await Users.find({ "subscription.status": "active" })
    stats[0].users = await Users.countDocuments();
    stats[0].subscription = subscription.length;
    stats[0].creatredAt = new Date(Date.now());
    await stats[0].save();

})



///update users Role
export const Comments = catchAsyncError(async (req, res, next) => {
    const { comments } = req.body;
    const user = await Users.findById(req.params.id);
    // const course = await Course.findById(req.params.id);
    const { courseId, lecturesId } = req.query;
    const course = await Course.findById(courseId);
    // if (!course) return next(new ErrorHandler("data not availble", 404));
    const lecture = course.lectures.find((item) => {
        if (item._id === lecturesId) return item;

    });
    await ExtraFN.create({
        comments,
        
    });

    res.status(201).json({
        success: true,
        user,
        lecture,
        message: 'Comments created successfully',
    });
});


/// get users only admin
export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await Users.find({});
    if (!users) return next(new ErrorHandler("user not availble", 404));
    res.status(201).json({
        succuss: true,
        users,
    })
});
export const getComments = catchAsyncError(async (req, res, next) => {

    const comments = await ExtraFN.find({});
    if (!comments) return next(new ErrorHandler("no commts", 404));
    res.status(201).json({
        
        comments,
        
    });
});