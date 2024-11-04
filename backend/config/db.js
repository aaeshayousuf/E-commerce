import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

//exporting a function which is asynchronous function; this is to make a request/response to an external database/resoources
export const connectDB = async() =>{
    try{
        // connect to the database
        await mongoose.connect(process.env.DATABASE_URL).then(() => console.log("Database connected"))
    }catch(error){
        console.log(error)
    }
}