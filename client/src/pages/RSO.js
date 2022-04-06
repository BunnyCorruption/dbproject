import React, { Component } from "react";
import { Card, Form, Button, Navbar, Container } from "react-bootstrap";

export default function RSO() {
  var state = {
    listitems: [
      { id: 0, college: "UCF", quantity: 0 },
      { id: 1, college: "UF", quantity: 0 },
      { id: 2, college: "College of Ye-Ye ass haircuts", quantity: 0 },
    ],
  };

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
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <Card style={{ width: 800 }}>
            <Card.Body>
              <h2 className="text-center mb-4">RSO</h2>
              <ul className="list-group">
                {state.listitems.map((listitem) => (
                  <li
                    className="list-group-item list-group-item-primary p-2"
                    key={listitem.id}
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                      {listitem.college} 
                      </div>
                      <div className="text-right">
                      {listitem.quantity}
                      </div>
                      <Button >Join</Button>
                    </div>


                  </li>
                ))}
              </ul>
              <Button className="w-100 mt-4">Logout</Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}
