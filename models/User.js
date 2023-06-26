import validator from "validator";
import Jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import bcr from "bcrypt"
import crypto from 'crypto'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Plser enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your eamil"],
        uique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        // minLenght: [6, "Password must be at leat 6 charactors"],
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    subscription: {
        id: String,
        status: String,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    playlist: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        poster: String,
    }],
    CreateAT: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,

});



UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcr.hash(this.password, 10);
    next()
})
UserSchema.methods.getJWTToken = function () {
    return Jwt.sign({ _id: this._id }, process.env.JWT_SCIRET, {
        expiresIn: "15d"
    });
}
UserSchema.methods.comparePassword = async function (password) {
    return await bcr.compare(password, this.password)
};
//  console.log(crypto.randomBytes(20).toString("hex"))
UserSchema.methods.getResteToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256")
        .update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

}
export const Users = mongoose.model("User", UserSchema)