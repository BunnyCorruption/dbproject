import React from "react";
import { Card, Button, Navbar, Container } from "react-bootstrap";
import Axios from "axios";
import { Link } from "react-router-dom";


export default class RSO extends React.Component {
  schoolName;
  state = {
    schools: [],
    suggests: [],
  };
  
  
  componentDidMount() {
    Axios.get("http://localhost:3001/api/get/rso/").then((res) => {
      //console.log(res.data);
      const schools = res.data;
      this.setState({ schools });
    });
  }

  suggestRSO() {
    Axios.post("http://localhost:3001/api/post/rso/", { newrso: 'e' }).then(
      (res) => {
        //console.log(res)
      },
      (err) =>{
        //console.log(err)
      }
    );
  }

  render() {
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
            <Card style={{ width: 800, height: "600px" }}
                  className="overflow-auto">
              <Card.Body>
                <h2 className="text-center mb-4">
                  Registered Student Organizations
                </h2>
                <ul className="list-group">
                  {this.state.schools
                  .filter(key => key.count > 4)
                  .map((listitem) => (
                    <li
                      className="list-group-item list-group-item-primary p-2"
                      key={listitem.rsoid}
                    >
                      <div className="d-flex justify-content-between">
                        <div>{listitem.rName} 
                        {listitem.count}</div>
                        <Button>Join</Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button className="w-100 mt-4" onClick={this.suggestRSO}>
                  Return
                </Button>
              </Card.Body>
            </Card>
            <Card style={{ width: 800, height: "600px" }} className="m-4 overflow-auto">
              <Card.Body>
                <h2 className="text-center mb-4">
                  Suggest an RSO
                </h2>
                <ul className="list-group">
                  {this.state.schools.filter(key => key.count < 5)
                  .map((listitem) => (
                    <li
                      className="list-group-item list-group-item-primary p-2"
                      key={listitem.rsoid}
                    >
                      <div className="d-flex justify-content-between">
                        <div>{listitem.rName} 
                        {listitem.count}</div>
                        <Button>Suggest</Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button className="w-100 mt-4" onClick={this.suggestRSO}>
                  Return
                </Button>
                </Card.Body>
            </Card>
          </Container>
        </div>
      </>
    );
  }
}
