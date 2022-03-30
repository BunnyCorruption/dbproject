import React, {useState} from 'react';
import { Card, Form, Button } from "react-bootstrap";
import index from "../"
import Axios from 'axios';



export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

//   async function handleSubmit(s) {
//     s.preventDefault();

//     var { uname, pass } = document.forms[0];

//     // Find user info
//     const userData = e.find((user) => user.username === uname.value);

//     try {
//         setErrorMessage("")
//         if (userData) {
//             if (userData.password !== pass.value) {
//                 setErrorMessage("Invalid password")
//             } else {
//                 setIsSubmitted(true)
//             }
//         }
//     } catch {
//         setErrorMessage("Failed to log in");
//     }
//     setIsSubmitted(false);
//   }

//   const submitReview = () => {
//     console.log(username);
//     console.log(password);
//     Axios.post('http://localhost:3001/api/insert', {
//       usery: username,
//       passy: password,
//     }).then(()=>{
//       alert("succ");
//     })
//   };


  return (
    <>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                <Form>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" name="uname" 
                            onChange={(e)=> {
                            setUsername(e.target.value);}} required /> 
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="pass" 
                            onChange={(e)=> {
                            setPassword(e.target.value);}}required />
                    </Form.Group>
                    <Button className="w-100 mt-4" type="submit">Log In</Button>
                    <Button className="w-100 mt-2" type="button" href="/register">Register</Button>
                </Form>
            </Card.Body> 
        </Card>
    </>
    // <div className="App">
    //  Howdy
    //   <div className='form'>
    //     <label>username</label>
    //   <input type="text" name="username" onChange={(e)=> {
    //     user(e.target.value);
    //   }}/>
    //   <label>password</label>
    //   <input type="text" name="password" onChange={(e)=> {
    //     pass(e.target.value);
    //    }}/>
    //   </div>
    //   <button onClick={submitReview}>Submit</button>
    // </div>
  );
}

