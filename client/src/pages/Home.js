import React, { useEffect } from "react";
import { Modal, Button, Navbar, Container, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Draggable, Map, Marker } from "pigeon-maps";

export default function Home() {
  const [show, setShow] = React.useState(false);
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const [eName, seteName] = React.useState("");
  const [time, setTime] = React.useState("");
  const [privacy, setPrivacy] = React.useState("Everyone");
  const [description, setDescription] = React.useState("");
  const [newComment, setnewComment] = React.useState("");
  const [cuser, setCuser] = React.useState("");
  const [commenteid, setCommenteid] = React.useState(0);
  const [events, setEvents] = React.useState([]);
  const [comments, setComments] = React.useState([]);
  const [anchor, setAnchor] = React.useState([
    28.605064831835453, -81.19917195288905,
  ]);
  const [role, setRole] = React.useState("Everyone");
  const [isAdmin, setAdmin] = React.useState(false);

  let navigate = useNavigate();
  function routeChange() {
    let path = `/rso`;
    navigate(path);
  }

  async function logout() {
    Axios.get("http://localhost:3001/api/logout").then((response) => {
      if (!response.data.auth) {
        localStorage.setItem("token", "");
        navigate("/");
      }
    });
  }

  function createEvent() {
    Axios.post("http://localhost:3001/api/event", {
      eName: eName,
      time: time,
      description: description,
      privacy: privacy,
      place: anchor,
    }).then(
      (response) => {
        console.log(response);
      },
      (err) => {
        console.log(err);
      }
    );
    setAnchor([28.605064831835453, -81.19917195288905]);
    reRender();
    handleClose();
  }

function postComment() {
    
      Axios.post("http://localhost:3001/api/comment", {
        text: newComment,
        cuser: cuser,
        eid: commenteid,
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
    
  Axios.get("http://localhost:3001/api/get/event").then(
        (res) => {
          //console.log(res.data);
          const event = res.data;
          setEvents(event);
          //console.log(events);
        },
        (err) => {
          console.log(err);
        }
      );

      Axios.get("http://localhost:3001/api/get/comments").then(
        (res) => {
          //console.log(res.data);
          const comments = res.data;
          setComments(comments);
          //console.log(events);
        },
        (err) => {
          console.log(err);
        }
      );

      Axios.get("http://localhost:3001/api/login").then(
        (response) => {
          if (response.data.loggedIn === true) {
            setRole(response.data.user[0].role);
            setCuser(response.data.user[0].username);

            if (role === "Admin" || role === "Super Admin") setAdmin(true);
            //console.log(isAdmin);
          }
        },
        (err) => {
          console.log(err);
        }
      );
      
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
            <Button
              type="button"
              className="pull-right"
              onClick={handleOpen}
              disabled={isAdmin}
            >
              Create an Event
            </Button>
            <Button
              type="button"
              className="mx-4 pull-right"
              onClick={routeChange}
            >
              Join an RSO
            </Button>
            <Button
              type="button"
              className="pull-right btn btn-warning"
              onClick={logout}
            >
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
                <Form >
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
                  <Form.Group className="mt-2" id="location">
                    <Form.Label>Location</Form.Label>
                    <Map
                      onClick={(e) => {
                        setAnchor(e.target.value);
                      }}
                      name="location"
                      height={200}
                      defaultCenter={[28.605064831835453, -81.19917195288905]}
                      defaultZoom={13}
                    >
                      <Draggable anchor={anchor} onDragEnd={setAnchor}>
                        <Marker width={40} anchor={anchor} />
                      </Draggable>
                    </Map>
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
        <h1 className="text-white text-center pt-2">Daily Events</h1>
        <Container className="d-flex align-items-center justify-content-center">
          <Card
            style={{ minWidth: 900, maxHeight: 800 }}
            className="overflow-auto m-4 h-auto"
          >
            <Card.Body>
              <ul className="list-group" style={{ minWidth: 900 }}>
                {events.map((listitem) => (
                  <li
                    className="list-group-item list-group-item-primary p-2"
                    key={listitem.eid}
                  >
                    <div className="d-flex justify-content-between m-2">
                      <div>
                        <h2>{listitem.name}</h2>
                        <div className="my-1">
                          {listitem.time}
                          <div>{listitem.place}</div>
                          <div>{listitem.description}</div>
                        </div>
                        <div className="pb-3">Privacy: {listitem.privacy}</div>
                        <ul className="list-comments border-top border-dark p-2">
                          {comments
                            .filter((key) => key.eid === listitem.eid)
                            .map((comms) => (
                              <li
                                className="list-group-item list-group-item-primary p-2 rounded bg-transparent bg-gradient"
                                key={comms.cid}
                              >
                                <div className="d-flex justify-content-between m-2 ">
                                  <div>
                                    {comms.cuser}
                                    <br />
                                    {comms.text}
                                  </div>
                                  <div>{comms.rating}</div>
                                </div>
                              </li>
                            ))}
                        </ul>
                        <Form className="center mt-4" onSubmit={postComment}>
                          <Form.Group id="newComment">
                            <Form.Control
                              type="text"
                              name="newComment"
                              style={{ minWidth: 900 }}
                              onChange={(e) => {
                                setnewComment(e.target.value);
                                setCommenteid(listitem.eid);
                              }}
                            />
                          </Form.Group>
                          <Button
                            style={{ maxHeight: 50 }}
                            className="mt-4"
                            onClick={postComment}
                          >
                            Comment
                          </Button>
                        </Form>
                      </div>

                      <Button style={{ maxHeight: 50 }} className="mb-5">
                        Join
                      </Button>
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
