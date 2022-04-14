import React, { useEffect } from "react";
import { Card, Button, Navbar, Container, Form } from "react-bootstrap";
import Axios from "axios";
import { Link } from "react-router-dom";

export default function RSO() {
  
  const [schools, setSchools] = React.useState([]);
  const [newRSO, setRSO] = React.useState("");
  
  function createRSO() {
    Axios.post("http://localhost:3001/api/post/RSO", {
      newrso: newRSO,
    }).then(
      (response) => {
        console.log(response);
      },
      (err) => {
        console.log(err);
      }
    );
    reRender();

  }

  function reRender() {
    Axios.get("http://localhost:3001/api/get/rso/").then((res) => {
      //console.log(res.data);
      const schools = res.data;
      setSchools(schools);
    });
  }

  useEffect(() => {
    reRender();
  }, []);

    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/home">
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
              <Link to="/Home">
                <Button type="button" className="mx-4 pull-right">
                  Main Page
                </Button>
              </Link>
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
            <Card
              style={{ minWidth: 400, minHeight: 400, maxHeight: "800px" }}
              className="overflow-auto border rounded-3 border-warning"
            >
              <Card.Body>
                <h2 className="text-center mb-4">
                  Registered Student Organizations
                </h2>
                <ul className="list-group">
                  {schools
                    .filter((key) => key.count > 4)
                    .map((listitem) => (
                      <li
                        className="list-group-item list-group-item-primary p-2"
                        key={listitem.rsoid}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            {listitem.name}
                            <div className="my-1">
                              Student Count: {listitem.count}
                            </div>
                          </div>
                          <Button>Join</Button>
                        </div>
                      </li>
                    ))}
                </ul>
              </Card.Body>
            </Card>
            <Card
              style={{ minWidth: 400, maxHeight: "800px" }}
              className="m-4 overflow-auto border rounded-3 border-warning"
            >
              <Card.Body>
                <h2 className="text-center mb-4">
                  RSOs that need more Members
                </h2>
                <ul className="list-group">
                  {schools
                    .filter((key) => key.count < 5)
                    .map((listitem) => (
                      <li
                        className="list-group-item list-group-item-primary p-2"
                        key={listitem.rsoid}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            {listitem.name}
                            <div className="my-1">
                              Student Count: {listitem.count}
                            </div>
                          </div>
                          <Button>Suggest</Button>
                        </div>
                      </li>
                    ))}
                </ul>
              </Card.Body>
              <Card.Body>
                <Form>
                  <Form.Group id="newrso">
                    <Form.Label>Have an idea for a new RSO?</Form.Label>
                    <Form.Control
                      type="text"
                      name="newrso"
                      onChange={(e) => {
                        setRSO(e.target.value);  
                      }}
                      required
                    />
                  </Form.Group>

                  <Button className="w-100 mt-4" onClick={createRSO}>
                    Suggest RSO
                  </Button>
                </Form>
              </Card.Body>
            </Card>
           </Container>
        </div>
      </>
    );
  }

