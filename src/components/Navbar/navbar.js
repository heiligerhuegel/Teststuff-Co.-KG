import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand>
          {/* <img alt="" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" />  */}
          <Link to="/">Heiligerhuegel</Link>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Nav;
