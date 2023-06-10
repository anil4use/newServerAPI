// import express  from "express";
// import Cousrse from "./routes/CourseRouter.js";
// import UserRouter from "./routes/UserRouter.js";
// import {ErrorMiddleware} from "./middlewares/Error.js";
// import cookieParser from "cookie-parser";
// import paymentRouter from "./routes/paymentRouter.js";
// import OtherRouter from "./routes/OtherRouter.js";
// import cor from 'cors'

// const app =express();
// app.use(express.json());
// app.use(express.urlencoded({
//     extended:true
// }))
// app.use(cookieParser());
// app.get("/", (req, res) => {
//     res.send("server is working");
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept'
//     );

// })
// app.use(
//     cor({
//         // origin:[process.env.FRONTEND_URL],
//         origin: '*',
//         methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
//         credentials:true,


//     }) 
// )

// app.use("/api/v1",Cousrse);
// app.use("/api/v1",UserRouter);
// app.use("/api/v1",paymentRouter);
// app.use("/api/v1",OtherRouter)

// export default app;
// app.use(ErrorMiddleware)
import express from "express";
import Cousrse from "./routes/CourseRouter.js";
import UserRouter from "./routes/UserRouter.js";
import { ErrorMiddleware } from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import paymentRouter from "./routes/paymentRouter.js";
import OtherRouter from "./routes/OtherRouter.js";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true
}));

app.get("/", (req, res) => {

  res.send("server is working");
});
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000',]; // Replace with your allowed origins

  const { origin } = req.headers;

  // Allow requests with credentials only from the specified origins
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use("/api/v1", Cousrse);
app.use("/api/v1", UserRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", OtherRouter);

app.use(ErrorMiddleware);

export default app;
