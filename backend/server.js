import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";


const app=express();
connectDb();

//Middle wares.
app.use(cors());
app.use(express.json())


app.use("/api/students", studentRoutes);


//test routes.
app.get("/",(req,res)=>{
    res.send("backend is running");
});

app.listen(5000,()=>{
    console.log("server is running on port 5000");
});

