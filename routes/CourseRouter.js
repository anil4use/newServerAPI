import express from"express"
import { getAllCourses,CreateCouse, getCourseLecture, addLecture, deleteCourese, deleteLecture } from "../controller/coureseController.js";
import singleUpload from "../middlewares/multer.js";
import { isAouthenticated, isAouthrizedAdmin, isAouthrizedSubscriber } from "../middlewares/auth.js";
const router =express.Router();
/// get all course
router.get("/course",getAllCourses);
//// create new course
router.post("/createcourse",isAouthenticated,isAouthrizedAdmin,singleUpload, CreateCouse);
//add lecture
router.get("/course/:id",isAouthenticated,isAouthrizedSubscriber,singleUpload,getCourseLecture);
///add letures
router.post("/course/:id",isAouthenticated,isAouthrizedAdmin,singleUpload,addLecture);
/// delete course
router.delete("/course/:id",isAouthenticated,isAouthrizedAdmin,deleteCourese);
/// deelte lecture
router.delete("/lecture",isAouthenticated,isAouthrizedAdmin,deleteLecture);
export default router;