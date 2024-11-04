import dotenv from "dotenv";
dotenv.config()
import jwt from "jsonwebtoken";

const signToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_KEY,{
        expiresIn: "1h"
    })
}

export default signToken;