import { useEffect,useState } from "react";
import axios from "axios";


function App(){

  const [students,setStudents]=useState([]);
  useEffect(()=>{
    axios.get("http://localhost:5000/api/students")
    .then((res)=>{setStudents(res.data.data)})
    .catch((err)=>{console.log(err)});
  },[]);
  return (
    <div>
      <h1>Student-Management-App</h1>
      {(students.length===0)
      ?(
      <p>No students found</p>
    ):(
        students.map((student) => (
          <div key={student._id}>
            <p>Name: {student.name}</p>
            <p>Email: {student.email}</p>
            <p>Age: {student.age}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;