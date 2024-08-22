import { useEffect } from "react";
import { Button, Form, FormGroup, Container, Col } from "react-bootstrap";
import gsap from "gsap";
import { Link } from "react-router-dom";

function Register() {
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
          <h1 className="text-center mb-4 fw-bold">Register</h1>
          <Form>
            <FormGroup className="mb-2">
              <label htmlFor="fullname">Fullname</label>
              <input
                type="fullname"
                name="fullname"
                id="fullname"
                placeholder="Enter fullname"
                className="form-control"
              />
            </FormGroup>
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
            <FormGroup className="mb-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                className="form-control"
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <label htmlFor="confirm-password">Password</label>
              <input
                type="confirm-password"
                name="confirm-password"
                id="confirm-password"
                placeholder="Enter confirm password"
                className="form-control"
              />
            </FormGroup>
            <div className="d-grid gap-2 mb-3 mt-4">
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
                Register
              </Button>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              Already have an account?{" "}
              <Link to="/login" className="ms-1 text-decoration-none fw-bold">
                Login
              </Link>
            </div>
          </Form>
        </div>
      </Col>
    </Container>
  );
}

export default Register;
