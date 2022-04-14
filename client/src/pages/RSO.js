import React from "react";
import { Card, Button, Navbar, Container, Form } from "react-bootstrap";
import Axios from "axios";
import { Link } from "react-router-dom";

export default class RSO extends React.Component {
  constructor(props){
  super(props);
  this.state = {
    schools: [],
    suggests: [],
    newrso: ''
  };
}

  componentDidMount() {
    Axios.get("http://localhost:3001/api/get/rso/").then((res) => {
      //console.log(res.data);
      const schools = res.data;
      this.setState({ schools });
    });
  }

  

  render() {
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
              style={{  minWidth: 400, height: "800px" }}
              className="overflow-auto"
            >
              <Card.Body>
                <h2 className="text-center mb-4">
                  Registered Student Organizations
                </h2>
                <ul className="list-group">
                  {this.state.schools
                    .filter((key) => key.count > 4)
                    .map((listitem) => (
                      <li
                        className="list-group-item list-group-item-primary p-2"
                        key={listitem.rsoid}
                      >
                        <div className="d-flex justify-content-between">
                          <div>{listitem.name}
                          <div className="my-1">
                            Student Count: {listitem.count}
                          </div></div>
                          <Button>Join</Button>
                        </div>
                      </li>
                    ))}
                </ul>
              </Card.Body>
            </Card>
            <Card
              style={{  minWidth:400, height: "800px" }}
              className="m-4 overflow-auto"
            >
              <Card.Body>
                <h2 className="text-center mb-4">RSOs that need more Members</h2>
                <ul className="list-group">
                  {this.state.schools
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
            </Card>
            <Card style={{midWidth: 400}}>
              <Card.Body>
                <Form>
                  <Form.Group id="newrso">
                    <Form.Label>RSO</Form.Label>
                    <Form.Control
                      type="text"
                      name="newrso"
                      
                      onChange={(e) => {
                        this.setState({newrso:e.target.value});
                        
                      }}
                      required
                    />
                  </Form.Group>
                  {/*
                  

Axios.post("http://localhost:3001/api/post/rso/", { newrso: this.state.newrso }).then(
      (res) => {
        //console.log(res)
      },
      (err) => {
        //console.log(err)
      }
    )

                  
                  <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    placeholder=""
                    onSubmit={(e) => {
                      this.description= e.target.value;
                    }}
                  />
                  </Form.Group>
                  <Form.Group className="mt-3" id="privacy">
                  <Form.Label>Privacy</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="privacy"
                      onSubmit={(e) => {
                        this.privacy =e.target.value;
                        console.log(this.privacy);
                      }}
                      required
                    >
                      <option value="Everyone">Everyone</option>
                      <option value="RSO">RSO</option>
                      <option value="Admins Only">Private</option>
                    </Form.Select>
                  </Form.Group>*/}
                  <Button className="w-100 mt-4"  type="submit">
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
}
