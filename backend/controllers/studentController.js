import Student from "../models/student.js";
export const addStudent = async(req, res) => {
  
  try{
    const student=await Student.create(req.body);
    res.status(201).json({
      success:true,
      message:"Student Added Successfully",
      data:student
    });
  } catch(error){
     if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages });
    }

    res.status(400).json({
      success:false,
      message:error.message
    });
  }
};

export const getAllStudents=async(req,res)=>{
  try{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 5;
    const skip=(page-1)*limit;
    const search=req.query.search || "";
    const sortField =req.query.sort || "name";
    const sortOrder=req.query.order==="desc"?-1:1;

    const total= await Student.countDocuments({name:{$regex:search,$options:"i"}});
    const students=await Student.find({name:{$regex:search,$options:"i"}}).skip(skip).limit(limit).sort({[sortField]:sortOrder});

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
};

export const getStudentById=async(req,res)=>{
  console.log("ID:", req.params.id, req.params.id.length);
  try{
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
     res.status(200).json({
      success:true,
      data:student
    });
  }catch(error){
    res.status(400).json({
      success:false,
      message:"Invalid Student id"
    });
  }
}

export const updateStudent=async(req,res)=>{
  try{
    const student= await Student.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
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
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
