import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from "react-bootstrap";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {

  return (         
      <Router>
        <Routes>
          {/* <Route path="/" element={ <PrivateRoute><HomePage /></PrivateRoute> }/>
          <Route path="/update" element={ <PrivateRoute><UpdatePage /></PrivateRoute> }/>     */}
          <Route path="/register" element={ <Signup /> } />
          {/* <Route path="/login" element={ <LoginPage /> } />
          <Route path="/forgot" element={ <ForgotPage /> } /> */}
        </Routes>
      </Router>
  );
}

export default App;
