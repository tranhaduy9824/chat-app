import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <Navbar
      bg="light"
      className="mb-2 rounded-pill px-2 m-auto"
      style={{ maxWidth: "1296px", height: "3.25rem" }}
    >
      <Container>
        <h3 className="mb-0">
          <NavLink to="/" className="link-dark text-decoration-none fw-bold">
            <FontAwesomeIcon icon={faComments} className=" me-2" />
            Chat
          </NavLink>
        </h3>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            <>
              <NavLink
                to="/login"
                className="link-dark text-decoration-none fw-bold"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="link-dark text-decoration-none fw-bold"
              >
                Register
              </NavLink>
            </>
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
