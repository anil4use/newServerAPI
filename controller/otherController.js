import ErrorHandler from "../middlewares/Error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Stats } from "../models/stats.js";
import { sendEmail } from "../utils/sendEmail.js";

export const ContectForm = catchAsyncError(async (req, res, next) => {

    const { name, email, desc } = req.body;
    if (!name || !email || !desc) return next(new ErrorHandler("please fill the all ", 404));
    const to = process.env.TO_MAIL;
    const subject = "contect form coursebunder"
    const text = `my name is ${name}and my mail is ${email} \n and massage ${desc}`
    await sendEmail(to, subject, text);
    // console.log(sendEmail)
    res.status(201).json({
        succuss: true,
        message: "your massege has been sent"
    })
});
export const CourseRequest = catchAsyncError(async (req, res, next) => {

    const { name, email, course } = req.body;
    if (!name || !email || !course) return next(new ErrorHandler("please fill the all ", 404));
    const to = process.env.TO_MAIL;
    const subject = "contect form coursebunder"
    const text = `my name is ${name}and my mail is ${email} \n and massage ${course}`
    await sendEmail(to, subject, text)
    res.status(201).json({
        succuss: true,
        message: "your request  has been sent"
    })
});

export const adminDesbord = catchAsyncError(async (req, res, next) => {
    const stats = await Stats.find({}).sort({ creatredAt: "desc" }).limit(12);
    const statsData = [];

    for (let i = 0; i < stats.length; i++) {
        statsData.unshift(stats[i]);

    }
    const requerdSize = 12 - stats.length;
    for (let i = 0; i < requerdSize; i++) {
        statsData.unshift({
            users: 0,
            subscription: 0,
            views: 0
        })
    }
    const userCount = statsData[11].users
    const userSubscription = statsData[11].subscription
    const userViews = statsData[11].views
    let userProfit = true,
        viewsProfit = true,
        subscriptionProfit = true
    let userParcentage = 0,
        viewsParcentage = 0,
        subscriptionPercentage = 0


  
    if (statsData[10].users === 0) userParcentage = userCount * 100
    if (statsData[10].views === 0) userParcentage = userViews * 100
    if (statsData[10].subscription === 0) userParcentage = userSubscription * 100;

    else {
        const differnce = {
            users: statsData[11].users - statsData[10].users,
            views: statsData[11].views - statsData[10].views,
            subscription: statsData[11].subscription - statsData[10].subscription,
        }
        userParcentage = (differnce.users / statsData[10].users) * 100;
        viewsParcentage = (differnce.views / statsData[10].views) * 100;
        subscriptionPercentage = (differnce.subscription / statsData[10].subscription) * 100;
        if (userParcentage < 0) userProfit = false
        if (viewsParcentage < 0) viewsProfit = false
        if (subscriptionPercentage < 0) subscriptionProfit = false
    }
    res.status(201).json({
        succuss: true,
        stats: statsData,
        userCount,
        userSubscription,
        userViews,
        subscriptionPercentage,
        viewsParcentage,
        userParcentage,
        userProfit,
        viewsProfit,
        subscriptionProfit

    })
});
