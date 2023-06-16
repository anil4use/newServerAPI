import express from"express"
import { getAllCourses,CreateCouse, getCourseLecture, addLecture, deleteCourese, deleteLecture } from "../controller/coureseController.js";
import singleUpload from "../middlewares/multer.js";
import { isAuthenticated, isAouthrizedAdmin, isAouthrizedSubscriber } from "../middlewares/auth.js";
const router =express.Router();
/// get all course
router.get("/course",getAllCourses);
//// create new course
router.post("/createcourse",isAuthenticated,isAouthrizedAdmin,singleUpload, CreateCouse);
//add lecture
router.get("/course/:id",isAuthenticated,isAouthrizedSubscriber,singleUpload,getCourseLecture);
///add letures
router.post("/course/:id",isAuthenticated,isAouthrizedAdmin,singleUpload,addLecture);
/// delete course
router.delete("/course/:id",isAuthenticated,isAouthrizedAdmin,deleteCourese);
/// deelte lecture
router.delete("/lecture",isAouthrizedAdmin,deleteLecture);
export default router;