import React, { Component } from "react";
import { Card, Form, Button, Navbar, Container } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#rso">
            <img
              alt=""
              src="/pngwing.com.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Calend-R-U-Coming?
          </Navbar.Brand>
          <div>
            <Button type="button" className="pull-right">
              Create an Event
            </Button>
            <Button type="button" className="mx-4 pull-right">
              Join an RSO
            </Button>
            <Button type="button" className="pull-right btn btn-warning">
              Logout
            </Button>
          </div>
        </Container>
      </Navbar>
      <div className="bg">
        {/* build page here por'favor */}
      </div>
    </>
  );
}
