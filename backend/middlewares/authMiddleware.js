import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
//to check for token and verify it
export const authenticate = catchAsync(async(req, res, next) =>{
    let token;

    token = req.cookies.jwt;
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        }catch(error){
            console.log(error);
            res.status(401)
            throw new Error("Not Authorized, token failed")
        }
    }else{
        res.status(401)
        throw new Error("Not Authorized, no token")
    }
})