import express from 'express'
import { isAouthenticated } from '../middlewares/auth.js';
import { buySubscription, cencelSubscription, getRazorPayKey, paymentVerificaton } from '../controller/paymentController.js';

const router= express.Router();
////buy subscription
router.get("/subscribe", isAouthenticated,buySubscription);
////subscription verification
router.post("/paymentverification", isAouthenticated,paymentVerificaton);
///get rozorpay key
router.get("/razorkey" ,getRazorPayKey);
///cancel subscription
router.delete("/subscribe/cencel",isAouthenticated,cencelSubscription)

export default router;