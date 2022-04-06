import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from "react-bootstrap";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import RSO from "./pages/RSO";
import Home from "./pages/Home";
function App() {

  return (         
      <Router>
        <Routes>
          <Route path="/register" element={ <Signup /> } />
          <Route path="/" element={ <Login /> } />
          <Route path="/main" element={<Main />} />
          <Route path="/rso" element={<RSO />}/>
          <Route path="/home" element={<Home />}/>
        </Routes>
      </Router>
  );
}

export default App;
