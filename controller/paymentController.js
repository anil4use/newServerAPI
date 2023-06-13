import ErrorHandler, { ErrorMiddleware } from "../middlewares/Error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Users } from "../models/User.js";
import { Payment } from "../models/payment.js";
import { instance } from '../server.js';
import crypto from 'crypto'


//// buy subscription
export const buySubscription = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    if (user.role === "admin") return next(new ErrorHandler("User Can't buy subscription", 404));
    const plan_id = process.env.RAZORPAY_PAYMET_PLANE_ID || plan_LqOJrHSS4k92OP
    const subscription = await instance.subscriptions.create({
        plan_id,
        customer_notify: 1,
        total_count: 12,
    });
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;
    await user.save()
    res.status(201).json({
        succuss: true,
        // message: "subscription buy succussfully"
        subscriptionId: subscription.id
    })
});
//// buy subscription
export const paymentVerificaton = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    const { razorpay_signature, razorpay_subscription_id, razorpay_payment_id } = req.body;
    const subscription_id = user.subscription.id;
    const gernereted_signature = crypto.createHmac("sha256",
        process.env.RAZORPAY_PAYMET_SCERET).update(razorpay_payment_id + "|" + subscription_id, "utf-8").digest("hex");
    const isAuthntic = gernereted_signature === razorpay_signature;
    if (!isAuthntic) return res.redirect(`${process.env.FRONTEND_URL}/payment fialed`)
    await Payment.create({
        razorpay_signature,
        razorpay_subscription_id,
        razorpay_payment_id
    })
    user.subscription.status = "active"
    user.save()
    res.redirect(`${process.env.FRONTEND_URL}/paymentsuccuss?payment_id=${razorpay_subscription_id}`)
});
////get rozorpay key
export const getRazorPayKey = catchAsyncError(async (req, res, next) => {
    res.status(201).json({
        succuss: true,
        subscriptionKEY: process.env.RAZORPAY_PAYMET_KEY
    })
});

// export const cencelSubscription = catchAsyncError(async (req, res, next) => {
//     const user = await Users.findById(req.user.body);
//     const subscriptionId = user.subscription.id;
//     let found = false;
//     await instance.subscriptions.cancel(subscriptionId)
//     const payment = await Payment.findOne({
//         razorpay_subscription_id: subscriptionId
//     })
//     const gap = Date.now() - payment.creatredAt
//     const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;
//     if (refundTime > gap) {
//         instance.payments.refund(payment.razorpay_subscription_id)
//         found = true
//     }
//     await payment.deleteOne();
//     user.subscription.id = undefined;
//     user.subscription.status = undefined;
//     await user.save()
//     res.status(201).json({
//         succuss: true,
//         massage: found ? "refund succuss-fully ,you will resive full found within 7 days"
//             : "subscription after 7 day "
//     })
// });
// import Users from '../models/Users';
// import Payment from '../models/Payment';

// export const cancelSubscription = catchAsyncError(async (req, res, next) => {
//     const user = await Users.findById(req.user.body);
//     if (!user.subscription) {
//         return res.status(400).json({ success: false, message: 'No subscription found' });
//     }

//     const subscriptionId = user.subscription.id;
//     let found = false;
//      instance.subscriptions.cancel(subscriptionId);
    
//     const payment = await Payment.findOne({
//         razorpay_subscription_id: subscriptionId
//     });

//     const gap = Date.now() - payment.creatredAt;
//     const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;
    
//     if (refundTime > gap) {
//         // instance.payments.refund(payment.razorpay_subscription_id);
//         found = true;
//     }

//     await payment.deleteOne();
//     user.subscription.id = undefined;
//     user.subscription.status = undefined;
//     await user.save();

//     res.status(201).json({
//         success: true,
//         message: found ? "Refund successful. You will receive a full refund within 7 days."
//             : "Subscription canceled after 7 days."
//     });
// });
export const cancelSubscription = catchAsyncError(async (req, res, next) => {
    const userId = req.user.body; // Assuming req.user.body contains the user ID
  
    try {
      const user = await Users.findById(userId);
  
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }
  
      if (!user.subscription) {
        return res.status(400).json({ success: false, message: 'No subscription found' });
      }
  
      const subscriptionId = user.subscription.id;
      let found = false;
  
      await instance.subscriptions.cancel(subscriptionId);
  
      const payment = await Payment.findOne({
        razorpay_subscription_id: subscriptionId
      });
  
      const gap = Date.now() - payment.createdAt;
      const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;
  
      if (refundTime > gap) {
        instance.payments.refund(payment.razorpay_subscription_id);
        found = true;
      }
  
      await payment.deleteOne();
      user.subscription.id = undefined;
      user.subscription.status = undefined;
      await user.save();
  
      return res.status(201).json({
        success: true,
        message: found ? 'Refund successful. You will receive a full refund within 7 days.' : 'Subscription canceled after 7 days.'
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while cancelling the subscription' });
    }
  });
  