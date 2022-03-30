import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from "react-bootstrap";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";

function App() {

  return (         
      <Router>
        <Routes>
          <Route path="/register" element={ <Signup /> } />
          <Route path="/" element={ <Login /> } />
          <Route path="/main" element={<Main />} />
        </Routes>
      </Router>
  );
}

export default App;
