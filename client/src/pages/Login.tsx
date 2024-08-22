import { useEffect } from "react";
import { Button, Form, FormGroup, Container, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import gsap from "gsap";
import { Link } from "react-router-dom";

function Login() {
  const rotate = () => {
    gsap.to(".card", {
      duration: 0.8,
      opacity: 1,
      rotationY: 360,
      transformOrigin: "center center",
      ease: "power1",
    });
  };
  useEffect(() => {
    rotate();

    return () => {
      rotate();
    };
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Col xs={12} sm={8} md={6} lg={4}>
        <div
          className="card p-4"
          style={{
            opacity: 0,
            transform: "rotateY(180deg)",
            borderRadius: "var(--border-radius)",
          }}
        >
          <h1 className="text-center mb-4 fw-bold">Login</h1>
          <Form>
            <FormGroup className="mb-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                className="form-control"
              />
            </FormGroup>
            <div className="d-grid gap-2 mb-4 mt-4">
              <Button
                variant="primary"
                type="submit"
                className="fw-bold"
                style={{
                  border: "2px solid var(--primary-light)",
                  backgroundColor: "white",
                  color: "var(--text-dark)",
                }}
              >
                Login
              </Button>
            </div>
            <div className="mb-3">
              <Button variant="facebook" className="btn btn-primary w-100 mb-2">
                <FontAwesomeIcon icon={faFacebookF} className="me-2" />
                Login with Facebook
              </Button>
              <Button variant="google" className="btn btn-danger w-100">
                <FontAwesomeIcon icon={faGoogle} className="me-2" />
                Login with Google
              </Button>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="ms-1 text-decoration-none fw-bold"
              >
                Register
              </Link>
            </div>
          </Form>
        </div>
      </Col>
    </Container>
  );
}

export default Login;
