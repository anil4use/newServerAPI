export const catchAsyncError=(passedFuction)=>(req,res,next)=>{
    Promise.resolve(passedFuction(req,res,next)).catch(next)
console.log(next)
}
    
      
   
