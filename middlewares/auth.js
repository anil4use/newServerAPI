import jwt from 'jsonwebtoken'
import { Users } from "../models/User.js"
import { catchAsyncError } from './catchAsyncError.js'
import ErrorHandler from './Error.js';
export const isAouthenticated= catchAsyncError(async (req,res,next)=>{
    const {token}=req.cookies;
    if(!token)  return next(new ErrorHandler("Not logged in ", 401));

    const decoded= jwt.verify(token,process.env.JWT_SCIRET);
    req.user= await Users.findById(decoded._id);
    next()
});
export const isAouthrizedAdmin= catchAsyncError(async (req,res,next)=>{
   if(req.user.role!=="admin")
    return next(new ErrorHandler(`${req.user.role}is not allow to access this page`, 401));
    next()
})


export const isAouthrizedSubscriber= catchAsyncError(async (req,res,next)=>{
    if(req.user.subscription.status!=="active"&& req.user.role!=="admin")
     return next(new ErrorHandler("Only subscriber acces this page", 401));
     next()
 })