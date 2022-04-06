import React, {useState, useEffect} from 'react';
import { Card, Form, Button, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import "../pretty.css";


export default function Main() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    Axios.defaults.withCredentials = true;
    const logout = () => {
        //window.cookie
        
    };

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
                        <h2 className="text-center mb-4">Main</h2>
                        <Button className="w-100 mt-4" onclick="logout">Logout</Button>
                    </Card.Body> 
                </Card>
            </Container>
            </div>
        </>
      );
}

