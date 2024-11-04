import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createActivationToken } from "../utils/token.js";
import { mailSent1 } from "../utils/notification.js";
import jwt from "jsonwebtoken"; 
import {dirname} from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import catchAsync from "../utils/catchAsync.js";
import signToken from "../utils/signToken.js";
import { confirmPassword } from "../helper/index.js";
import createToken from "../utils/createToken.js";

//how to create a user 

// export const createUser = async(req, res) => {
//     try{
//         //destructuring the username,email and password all coming from req.body
//         const {username, email, password} = req.body;
//         //validate user input
//         if (!username || !email || !password) {
//             return res.status(400).json({
//                 message: "Please fill all the required fields",
//             })
//         }
//         // Validate email format
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             res.status(400).json({
//                 message: "please provide a valid email address",
//             })
//         }

//         //check for existing user

//         const userExists = await User.findOne({email})
//         if (userExists){
//             res.status(400).json({
//                 message: "email already exists"
//             })
//         }

//         // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
//         // if(!passwordRegex.test(password)) {
//         //     res.status(400).json({
//         //         message: "Password must contain at least one uppercase, lowercase, special character and one number"
//         //     })
//         // }

//         //TODO HASH PASSWORD

//         const salt = await bcrypt.genSalt(10);

//         const hashedPassword = await bcrypt.hash(password, salt);
        
//         // create token
//         const { token, activationCode } = createActivationToken({username, email, password:hashedPassword});

//         const emailData = {user:{username}, activationCode};
//         //to link the ejs. path is function in node.js, its not installed
//         const templatePath = path.join(__dirname, "../mails/activation-mails.ejs");

//         try{
//             const html = await ejs.renderFile(templatePath, emailData)

//             await User.create({
//                 username,
//                 email,
//                 password:hashedPassword
//             });
//             //function to send mail
//             await mailSent1({
//                 email,
//                 subject: "Email Verification",
//                 template: "activation-mails.ejs",
//                 emailData
//             });

//             res.status(200).json({
//                 status: "success",
//                 message: `Please check your email ${email} to verify your account`,
//                 activationToken: token,
//                 activationCode
//             })

//         }catch(error){
//             console.log(error);
//                 return res.status(500).json({
//                     message: "error sending email",
//                 })
//         }

//         //create a new user
//         // const newUser = User({ username, email, password:hashedPassword});

//         // try{
//         //     await newUser.save();
//         //     res.status(201).json({
//         //         message: "user created successfully",
//         //         user: newUser
//         //     })
//         // }catch(error){
//         //     console.log(error)
//         //     throw new Error("Invalid user data")
//         // };


//     }catch(error){
//         console.log(error);
//     }
// }

//function to catch async errors
export const activateUser = catchAsync(async(req,res,next) => {
    const {activation_token, activation_code} = req.body;
  
    //if i dont have activationcode or activationtoken return error

    if(!activation_token || !activation_code) {
        return next(new Error("Invalid activation", 400))
    }

    //if i have activationcode and activationtoken

    try{
        const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)
        const { user, activationCode } = decoded; //destructuring the code

        //if activationCode is not the same as activation_code then return client error

        if (activationCode !== activation_code) {
            return next(new Error("Invalid activation", 400))
        }

        const userToActivate = await User.findOne({email:user.email});
        if (!userToActivate) {
            return next(new Error("User not found"));
        }

        userToActivate.isVerified = true;
        await userToActivate.save();

        const token = signToken({id:userToActivate._id});

        res.status(200).json({
            success: true,
            data:{
                user: userToActivate,
                token
            }
        })

    }catch(error){
        console.log("error validating user", error)
        return next(new Error("Error Activating User", 500));
    }

})

//login user

// export const loginUser = catchAsync(async(req,res,next) => {
//     try{
//         const { email, password } = req.body;
//         if(!email || !password){
//             return next(new Error("please provide your email and password")); 
//         }
//         const checkEmail = await User.findOne({email});
//         if(!checkEmail){
//             return next(new Error("User not found", 404));
//         }
//         const isPasswordCorrect = await confirmPassword(password, checkEmail.password);
//         if(!isPasswordCorrect){
//             return next(new Error("Invalid password", 400));
//         }
//         const token = signToken({id: checkEmail._id,});
//         res.status(200).json({
//             success: true,
//             data: {
//                 user: checkEmail,
//                 token
//             }
//         })

//     }catch(error){
//         console.log("login error", error)
//         return next(new Error("Error logging In", 500));
//     }
// })

export const registerUser = async(req, res) => {
    try{
        //destructuring the username,email and password all coming from req.body
        const {username, email, password} = req.body;
        //validate user input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please fill all the required fields",
            })
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                message: "please provide a valid email address",
            })
        }

        //check for existing user

        const userExists = await User.findOne({email})
        if (userExists){
            res.status(400).json({
                message: "email already exists, login instead"
            })
        }

        //TODO HASH PASSWORD

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // create token
        const { token, activationCode } = createActivationToken({username, email, password:hashedPassword});

        const emailData = {user:{username}, activationCode};
        //to link the ejs. path is function in node.js, its not installed
        // const templatePath = path.join(__dirname, "../mails/activation-mails.ejs");

        // try{
        //     const html = await ejs.renderFile(templatePath, emailData)

        //     await User.create({
        //         username,
        //         email,
        //         password:hashedPassword
        //     });
        //     //function to send mail
        //     await mailSent1({
        //         email,
        //         subject: "Email Verification",
        //         template: "activation-mails.ejs",
        //         emailData
        //     });

        //     res.status(200).json({
        //         status: "success",
        //         message: `Please check your email ${email} to verify your account`,
        //         activationToken: token,
        //         activationCode
        //     })

        // }catch(error){
        //     console.log(error);
        //         return res.status(500).json({
        //             message: "error sending email",
        //         })
        // }

         //create a new user
        const newUser = User({ username, email, password:hashedPassword});

        try{
            await newUser.save();
            //create token
            createToken(res, newUser._id);

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin
            })
        }catch(error){
            console.log(error)
            throw new Error("Invalid user data")
        };


    }catch(error){
        console.log(error);
    }
}

export const loginUser2 = catchAsync(async(req,res,next) => {
    try{
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email});
        if(existingUser){
            const isPasswordValid = await bcrypt.compare(
                password, existingUser.password
            );

            if(isPasswordValid){
               const token = createToken(res, existingUser._id);

                res.status(200).json({
                    _id: existingUser._id,
                    username: existingUser.username,
                    email: existingUser.email,
                    isAdmin: existingUser.isAdmin,
                    token
                });
                return;
            }
        }else{
            res.status(401).json({
                message: 'Invalid email or password'
            })
        }

    }catch(error){
        console.log("login error", error)
        throw new Error("Error logging In", 500);
    }
})

export const logOutCurrentUser = catchAsync(async(req, res) => {
    try{
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({
            message: "User logged out successfully"
        })
    }catch(error){
        console.log(error)
        throw new Error("Internal Server Error")
    }
})

export const getAllUsers = async (req,res) => {
    try{
        const users = await User.find()
        res.status(200).json({
            success:true,
            data:users
        })
    }catch(error){
        console.log(error)
    }
}

export const getCurrentUserProfile = catchAsync(async(req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        if(user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
            })
        }else{
            res.status(404);
                throw new Error("User not found")
            
        }
    }catch(error){
        console.log(error)
        throw new Error('User not found, error updating profile')
    }
})

export const updateCurrentUserProfile = catchAsync(async (req, res) => {
    try{
        const user = await User.findById(req.user._id);

        if(user){
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            if(req.body.password){
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                user.password = hashedPassword;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin
            })
        }else{
            res.status(400);
            throw new Error("user not found")
        }
    }catch(error){
        console.log(error)
        throw new Error('User not found, error updating profile')
    }
})

export const deleteUserById =  catchAsync(async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(user){
            if(user.isAdmin){
                res.status(400).json({message: 'Cannot delete admin user'})
            }
            await User.deleteOne({_id:user._id});
            res.json({message: "User deleted successfully"})
        }else{
            res.status(404).json({message: "User not found"})
        }
    }catch(error){
        console.log(error)
        throw new Error('User not found by admin')
    }
})

export const getUserById = catchAsync(async (req, res) =>{
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(user){
            res.json(user)
        }else{
            res.status(404).json({message: 'User not found'});
        }
    }catch(error){
        console.log(error)
        throw new Error('User not found')
    }
})