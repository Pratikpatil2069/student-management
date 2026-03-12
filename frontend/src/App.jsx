import { useState, useEffect } from "react";
import axios from "axios";


function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editId ,setEditId]=useState(null);

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Load students when page loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      name,
      email,
      age: Number(age)
    };
    if(editId){
      try{
        await axios.put(`http://localhost:5000/api/students/update/${editId}`,studentData);
      }catch(error){
        console.log(error);
      }
    }else{
      try {
       await axios.post("http://localhost:5000/api/students/add",studentData);
      }catch (error) {
        console.log(error);
      }
    }
    fetchStudents(); // refresh list

      setName("");
      setEmail("");
      setAge("");
      setEditId(null);
  };

  // Delete student
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/delete/${id}`);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  //update student
  
  const updateStudent= (student)=>{
        setName(student.name);
        setEmail(student.email);
        setAge(student.age);
        setEditId(student._id);
  };
    
  

  return (
    <div style={{ padding: "30px" }}>

      <h1>Student Management</h1>

      {/* Add Student Form */}

      <form onSubmit={handleSubmit}>

        <h2>Add Student</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <br /><br />

        <button type="submit">{editId?"Update Student":"Add Student"}</button>

      </form>

      <hr />

      {/* Student List */}

      <h2>Student List</h2>

      {students.map((student) => (
        <div key={student._id}>

          <p>
            {student.name} | {student.email} | {student.age}
          </p>

          <button onClick={() => deleteStudent(student._id)}>
            Delete
          </button>

          <button  onClick={() => updateStudent(student)}>
            Edit
          </button>

          <hr />

        </div>
      ))}

    </div>
  );
}

export default App;