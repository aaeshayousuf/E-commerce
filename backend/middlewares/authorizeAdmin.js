import catchAsync from "../utils/catchAsync.js";

export const authorizeAdmin = catchAsync(async (req, res, next) => {
    try{
        if(req.user && req.user.isAdmin){
            next();
        }else{
            res.status(401).send("Not authorized as an admin")
        }
    }catch(error){
        console.log('admin authority error',error);
    }
})