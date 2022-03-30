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
  const [loginStatus, setLoginStatus] = useState("");

  const login = () => {
      Axios.post('http://localhost:3001/api/login', {
          username: username, 
          password: password,
        }).then((response) => {

            if (response.data.message) {
                setLoginStatus(response.data.message)
                
            } else {
                setLoginStatus(response.data[0].username)
            }
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
                    <h2 className="text-center mb-4">Log In</h2>
                    <Form onSubmit={login}>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="uname" 
                                onChange={(e)=> {
                                setUsername(e.target.value);}} required /> 
                        </Form.Group>
                        <Form.Group className="mt-2" id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="pass" 
                                onChange={(e)=> {
                                setPassword(e.target.value);}}required />
                        </Form.Group>
                        <Button className="w-100 mt-4" type="submit">Log In</Button>
                        <div className='w-100 text-center mt-2'>
                            <Link to="/register">Register</Link>
                        </div>
                    </Form>
                </Card.Body> 
            </Card>
        </Container>
        </div>
    </>
  );
}

