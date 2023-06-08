import express from "express"
import {
    registerUser, loginUser, logoutUser,
    getMyProfile, changePassword, updateProfile,
    updateprofilepicture, forgetpassword, resetepassword, addToPlayLinst, removeFromPlaylist, getAllUsers, updateUserRole, deleteMyprofile, deleteMyProfile
} from "../controller/userController.js";
import singleUpload from "../middlewares/multer.js";

import { isAouthenticated, isAouthrizedAdmin } from "../middlewares/auth.js";
const router = express.Router();
//register user 
router.post("/register",singleUpload, registerUser);

//login user
router.post("/login", loginUser);

//logout user
router.get("/logout", logoutUser);
///get user deteils
router.get("/me", isAouthenticated, getMyProfile);
///delete my profile
router.delete("/deleteMe", isAouthenticated, deleteMyProfile);
/// change password
router.put("/changepassword", isAouthenticated, changePassword);
//update profile
router.put("/updateprofile", isAouthenticated, updateProfile);
//update profile picture
router.put("/updateprofilepicture", isAouthenticated,singleUpload, updateprofilepicture);
///forget Password
router.post("/forgetpassword", forgetpassword);
//reset password
router.put("/resetepassword/:token", resetepassword);
//add to play list
router.post("/addtoplaylist", isAouthenticated,addToPlayLinst);
/// remove from playlist
router.delete("/removeplaylist", isAouthenticated,removeFromPlaylist);
//// get all users only admin
router.get("/admin/getAllUsers", isAouthenticated,isAouthrizedAdmin,getAllUsers);
///update User Role
router.put("/admin/updateUserRole/:id", isAouthenticated,isAouthrizedAdmin,updateUserRole);
/// delete users profile
router.delete("/admin/delete/:id", isAouthenticated,isAouthrizedAdmin,deleteMyprofile);
export default router;