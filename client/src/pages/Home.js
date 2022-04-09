import React, {  } from "react";
import { Modal, Button, Navbar, Container, Form  } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export default function Home() {

  const [show, setShow] = React.useState(false);
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  
  let navigate = useNavigate();
  const routeChange = () =>{ 
    let path = `/rso`; 
    navigate(path);
  }

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
            <Button type="button" className="pull-right" onClick={handleOpen}>
              Create an Event
            </Button>
            <Button type="button" className="mx-4 pull-right" onClick={routeChange}>
              Join an RSO
            </Button>
            <Button type="button" className="pull-right btn btn-warning">
              Logout
            </Button>
          </div>
        </Container>
      </Navbar>
      <div className="bg">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body><Form>
          <Form.Group>

          </Form.Group>
          </Form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>
        {/* build page here por'favor */}
      </div>
    </>
  );
}
