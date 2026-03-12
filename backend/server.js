import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app=express();

//Middle wares.
app.use(cors());
app.use(express.json())


// Connect to MongoDB
const connectDb=async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/student_db");
        console.log("database connection successful!");
    }catch(error){
        console.error("connection failed",error.message);
        process.exit(1);
    }
};
connectDb();

// Student schema & model
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email"]
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [120, "Age must be less than 120"]
    },
    course: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
const studentSchema = mongoose.model("studentSchema", Schema);

// 1.Add Students route.
app.post("/api/students/add", async (req, res) => {
  try {
   const student=await studentSchema.create(req.body);
    res.status(201).json({ 
        message: "Student added", 
        data: student 
    });
  } catch (err) {
    res.status(500).json({ 
        error: err.message 
    });
  }
});

// 2. Get All Students route.
 app.get("/api/students" ,async(req,res)=>{
  try{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 5;
    const skip=(page-1)*limit;
    const search=req.query.search || "";
    const sortField =req.query.sort || "name";
    const sortOrder=req.query.order==="desc"?-1:1;

    const total= await studentSchema.countDocuments({name:{$regex:search,$options:"i"}});
    const students=await studentSchema.find({name:{$regex:search,$options:"i"}}).skip(skip).limit(limit).sort({[sortField]:sortOrder});

    res.status(200).json({
      success:true,
      totalStudents:total,
      currentPage:page,
      totalPages:Math.ceil(total/limit),
      data:students
    });
  } catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
});

// 3.delete student route.
app.delete("/api/students/delete/:id",async(req,res)=>{
  try{
    const student=await studentSchema.findByIdAndDelete(req.params.id);
     if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } 
});

// update Student route.
app.put("/api/students/update/:id", async(req,res)=>{
  try{
     const student= await studentSchema.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
         if (!student) {
          return res.status(404).json({
            success: false,
            message: "Student not found",
          });
        }
         res.status(200).json({
          success: true,
          data: student,
        });
  }catch(error){
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
})


//test routes.
app.get("/",(req,res)=>{
    res.send("backend is running");
});

app.listen(5000,()=>{
    console.log("server is running on port 5000");
});

