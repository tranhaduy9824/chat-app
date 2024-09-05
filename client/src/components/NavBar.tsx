import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./Notification";
import Avatar from "./Avatar";
import Tippy from "@tippyjs/react";
import "tippy.js/themes/light.css";
import EditProfile from "./Modal/EditProfile";

function NavBar() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { user, logoutUser } = useContext(AuthContext)!;

  return (
    <>
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
          {user && (
            <span className="fw-bold">Logged in as {user?.fullname}</span>
          )}
          <Nav>
            <Stack direction="horizontal" gap={3}>
              {user ? (
                <>
                  <Notification />
                  <Tippy
                    interactive
                    content={
                      <div className="p-2 d-flex flex-column">
                        <span
                          className="fw-bold p-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowEditProfile(true)}
                        >
                          Edit profile
                        </span>
                        <NavLink
                          onClick={() => logoutUser()}
                          to="/login"
                          className="link-dark text-decoration-none fw-bold p-2"
                        >
                          Logout
                        </NavLink>
                      </div>
                    }
                    delay={[0, 500]}
                  >
                    <span>
                      <Avatar user={user} width={35} height={35} />
                    </span>
                  </Tippy>
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
      <EditProfile
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </>
  );
}

export default NavBar;
