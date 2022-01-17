import React from "react";
import { Container, Navbar } from "react-bootstrap";

function Nav() {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="#home">
          {/* <img alt="" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" />  */}
          Heiligerhuegel
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Nav;
