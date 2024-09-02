import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./Notification";

function NavBar() {
  const { user, logoutUser } = useContext(AuthContext)!;

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
        {user && <span className="fw-bold">Logged in as {user?.fullname}</span>}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user ? (
              <>
                <Notification />
                <NavLink
                  onClick={() => logoutUser()}
                  to="/login"
                  className="link-dark text-decoration-none fw-bold"
                >
                  Logout
                </NavLink>
              </>
            ) : (
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
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
