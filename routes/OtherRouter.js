import express from 'express'
import { isAouthenticated, isAouthrizedAdmin } from '../middlewares/auth.js';
import { ContectForm, CourseRequest, adminDesbord } from '../controller/otherController.js';

const router= express.Router();
router.post("/contect",ContectForm)
router.post("/coureserequest",CourseRequest);
router.get("/admin/stats/",isAouthenticated,isAouthrizedAdmin,adminDesbord)
export default router;