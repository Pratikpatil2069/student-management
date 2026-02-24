import mongoose from "mongoose";

 const connectDb=async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/student_db");
        console.log("database connection successful!");
    }catch(error){
        console.error("connection failed",error.message);
        process.exit(1);
    }
};

export default connectDb;