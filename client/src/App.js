import React, {useState} from "react";
import './App.css';
import Axios from 'axios';

function App() {

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
    <div className="App">
     Howdy
      <div className='form'>
        <label>username</label>
      <input type="text" name="username" onChange={(e)=> {
        user(e.target.value);
      }}/>
      <label>password</label>
      <input type="text" name="password" onChange={(e)=> {
        pass(e.target.value);
       }}/>
      </div>
      <button onClick={submitReview}>Submit</button>
    </div>
  );
}

export default App;
