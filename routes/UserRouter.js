import express from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    getMyProfile,
    changePassword,
    updateProfile,
    updateprofilepicture,
    forgetpassword,
    resetepassword,
    addToPlayLinst,
    removeFromPlaylist,
    getAllUsers,
    updateUserRole,
    deleteMyprofile,
    deleteMyProfile,
     Comments,
      getComments,
} from "../controller/userController.js";
import singleUpload from "../middlewares/multer.js";

import { isAuthenticated, isAouthrizedAdmin } from "../middlewares/auth.js";
const router = express.Router();
//register user 
router.post("/register", singleUpload, registerUser);

//login user
router.post("/login", loginUser);

//logout user

router.get("/logout", logoutUser);
///get user deteils
router.get("/me", isAuthenticated, getMyProfile);
///delete my profile
router.delete("/deleteMe", isAuthenticated, deleteMyProfile);
/// change password
router.put("/changepassword", isAuthenticated, changePassword);
//update profile
router.put("/updateprofile", isAuthenticated, updateProfile);
//update profile picture
router.put("/updateprofilepicture", isAuthenticated, singleUpload, updateprofilepicture);
///forget Password
router.post("/forgetpassword", forgetpassword);
//reset password
router.put("/resetepassword/:token", resetepassword);
//add to play list
router.post("/addtoplaylist", isAuthenticated, addToPlayLinst);
//// get addto playlist
// router.get("/getplaylist/:id", getPlayLinst);
/// remove from playlist
router.delete("/removeplaylist", isAuthenticated, removeFromPlaylist);
//// get all users only admin
router.get("/admin/getAllUsers", isAuthenticated, isAouthrizedAdmin, getAllUsers);
///update User Role
router.put("/admin/updateUserRole/:id", updateUserRole);
/// delete users profile
router.delete("/admin/delete/:id", isAuthenticated, isAouthrizedAdmin, deleteMyprofile);
/// user comments
router.post("/comments",Comments)
// router.post("/comments/:userID/:courseID/:lectureid",Comments)

router.get("/comments/:id",getComments)

export default router;