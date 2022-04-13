import React, {useState} from 'react';
import { Modal, Card, Form, Button, Navbar, Container, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from 'react-router-dom';
import index from "../"
import Axios from 'axios';
import "../pretty.css";



export default function Signup() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  Axios.defaults.withCredentials = true;
  // Register function
  const register = () => {
      Axios.post('http://localhost:3001/api/register', {
          username: username, 
          password: password,
          role: role,
        }).then((response) => {
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
                            <Form.Control type="email" name="username" 
                                onChange={(e)=> {
                                setUsername(e.target.value);}} required /> 
                        </Form.Group>
                        <Form.Group className="mt-2" id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" 
                                onChange={(e)=> {
                                setPassword(e.target.value);}}required />
                        </Form.Group>
                        <Form.Group className="mt-3" id="role">
                            <Form.Select aria-label="Default select example"  name="role" 
                                    onChange={(e)=> {
                                    setRole(e.target.value);}}required>
                                <option>Select Role</option>
                                <option value="Student">Student</option>
                                <option value="Admin">Admin</option>
                                <option value="Super Admin">Super Admin</option>
                            </Form.Select>
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

