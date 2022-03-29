import React, {useState} from 'react';
import { Card, Form, Button } from "react-bootstrap";
import Axios from 'axios';


export default function Login() {

  const [username, user] = useState("");
  const [password, pass] = useState("");

  const submitReview = () => {
    console.log(username);
    console.log(password);
    Axios.post('http://localhost:3001/api/insert', {
      usery: username,
      passy: password,
    }).then(()=>{
      alert("succ");
    })
  };


  return (
    <>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                <Form onSubmit={submitReview}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" required /> 
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" required />
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

