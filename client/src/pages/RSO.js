import React, { } from "react";
import { Card, Button, Navbar, Container } from "react-bootstrap";
import Axios from 'axios';


export default class RSO extends React.Component {
  
  state = {
    schools: []
  }

  componentDidMount(){
    Axios.get('http://localhost:3001/api/get/rso/').then(res => {
      console.log(res.data);
      const schools = res.data;
      this.setState({schools});
    })
  };

  suggestRSO(){
    console.log('ye');
    Axios.post('http://localhost:3001/api/post/rso/')
  }

render(){
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
                {this.state.schools.map((listitem) => (
                  <li
                    className="list-group-item list-group-item-primary p-2"
                    key={listitem.rsoid}
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                      {listitem.rName} 
                      </div>
                      <Button >Join</Button>
                    </div>


                  </li>
                ))}
              </ul>
              <Button onClick={this.suggestRSO} className="w-100 mt-4">Return</Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}
}