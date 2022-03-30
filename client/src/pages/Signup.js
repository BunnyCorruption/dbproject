import React, {useState} from 'react';
import { Card, Form, Button, Navbar, Container } from "react-bootstrap";
import { Link } from 'react-router-dom';
import index from "../"
import Axios from 'axios';
import "../pretty.css";



export default function Signup() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  Axios.defaults.withCredentials = true;
  // Register function
  const register = () => {
      Axios.post('http://localhost:3001/api/register', {
          username: username, 
          password: password,
        }).then((response) => {
            console.log(response);
            alert("Registration Successful!");
        });
  };


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
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="#home">
            <img
            alt=""
            src="/pngwing.com.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            />{' '}
            Calend-R-U-Coming?
            </Navbar.Brand>
            </Container>
        </Navbar>
        <div className="bg">
        <Container className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Register</h2>
                    <Form onSubmit={register}>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" 
                                onChange={(e)=> {
                                setUsername(e.target.value);}} required /> 
                        </Form.Group>
                        <Form.Group className="mt-2" id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" 
                                onChange={(e)=> {
                                setPassword(e.target.value);}}required />
                        </Form.Group>
                        <Button className="w-100 mt-4" type="submit">Register</Button>
                        <div className='w-100 text-center mt-2'>
                            <Link to="/">Login</Link>
                        </div>
                    </Form>
                </Card.Body> 
            </Card>
        </Container>
        </div>
    </>
  );
}

