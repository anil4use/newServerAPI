import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
import { buySubscription, cencelSubscription, getRazorPayKey, paymentVerificaton } from '../controller/paymentController.js';

const router= express.Router();
////buy subscription
router.get("/subscribe", isAuthenticated,buySubscription);
////subscription verification
router.post("/paymentverification", isAuthenticated,paymentVerificaton);
///get rozorpay key
router.get("/razorkey" ,getRazorPayKey);
///cancel subscription
router.delete("/subscribe/cencel",isAuthenticated,cencelSubscription)

export default router;