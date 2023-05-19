import express  from "express";
import Cousrse from "./routes/CourseRouter.js";
import UserRouter from "./routes/UserRouter.js";
import {ErrorMiddleware} from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import paymentRouter from "./routes/paymentRouter.js";
import OtherRouter from "./routes/OtherRouter.js";
import cor from 'cors'

const app =express();
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))
app.get("/", (req, res) => {
    res.send("server is working")
})
app.use(
    cor({
        origin:[process.env.FRONTEND_URL],
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    })
)
app.use(cookieParser())
app.use("/api/v1",Cousrse);
app.use("/api/v1",UserRouter);
app.use("/api/v1",paymentRouter);
app.use("/api/v1",OtherRouter)

export default app;
app.use(ErrorMiddleware)