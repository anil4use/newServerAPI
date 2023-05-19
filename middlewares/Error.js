// const ErrorMiddleware=(err,req,res,next)=>{
//     err.statusCode=err.statusCode||500;
//     err.massage=err.massage||'Enter server Error'
//     res.status(err.statusCode).json({
//         succuss:false,
//         massage:err.massage,
//     })
// }
// export default ErrorMiddleware;


class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode
    }
}
export const ErrorMiddleware=(err,req,res,next)=>{
        err.message=err.message ||"Internal Server Error";
        err.statusCode=err.statusCode||500;
    return res.status(404).json({
      succuss: true,
      message: err.message,
  })
  }
  export default ErrorHandler