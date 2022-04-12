import React, { useEffect } from "react";
import { Modal, Button, Navbar, Container, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

export default function Home() {
  const [show, setShow] = React.useState(false);
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const [eName, seteName] = React.useState("");
  const [time, setTime] = React.useState("");
  const [privacy, setPrivacy] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [events, setEvents] = React.useState([]);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/rso`;
    navigate(path);
  };

  const createEvent = () => {

    Axios.post("http://localhost:3001/api/event", {
      eName: eName,
      time: time,
      description: description,
      privacy: privacy,
    }).then((response) => {
      console.log(response);
    }, (err) => {
      console.log(err);
    });
    handleClose();
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/event").then((res) => {
      //console.log(res.data);
      const event = res.data;
      setEvents(event);
      console.log(events);
    });

  });

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
            <Button
              type="button"
              className="mx-4 pull-right"
              onClick={routeChange}
            >
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
            <h2>Create an Event</h2>

          </Modal.Header>
          <Modal.Body>
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group id="eName">
                    <Form.Label>Event Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="eName"
                      onChange={(e) => {
                        seteName(e.target.value);
                      }}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mt-2" id="time">
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="time"
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                      required
                    />
                  </Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    placeholder=""
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                  <Form.Group className="mt-3" id="privacy">
                    <Form.Label>Privacy</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="privacy"
                      onChange={(e) => {
                        setPrivacy(e.target.value);
                      }}
                      required
                    >
                      <option value="Everyone">Everyone</option>
                      <option value="RSO">RSO</option>
                      <option value="Admins Only">Private</option>
                    </Form.Select>
                  </Form.Group>
                  <Button className="w-100 mt-4" onClick={createEvent}>
                    Create Event
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <Card
            style={{ minWidth: 900, height: "800px", maxHeight: 600 }}
            className="overflow-auto m-4"
          >
            <Card.Body>
              <h2 className="text-center">
                Events
              </h2>
              <ul className="list-group">
                {events
                  .map((listitem) => (
                    <li
                      className="list-group-item list-group-item-primary p-2"
                      key={listitem.eid}
                    >
                      <div className="d-flex justify-content-between m-2">
                        <div><h2>{listitem.name}</h2>
                          <div className="my-1">
                            {listitem.time}
                            <div>{listitem.place}</div>
                            <div>{listitem.description}</div>
                          </div>
                          <div>Privacy: {listitem.privacy}
                          </div>
                          </div>
                        <Button style={{ maxHeight: 50 }}>Join</Button>
                      </div>
                    </li>
                  ))}
              </ul>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}
