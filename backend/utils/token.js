import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(activationCode);

    //token is an activation secret 
    //jwt- JSON Web Token it create a signature for the token, a secret is anythingç
    const token = jwt.sign({
        user,
        activationCode,
    }, process.env.ACTIVATION_SECRET, {
        expiresIn: '10m',
    })

    return {token, activationCode};
}