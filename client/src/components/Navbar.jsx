import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const NavigationBar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-danger fs-3">
          IMovies
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Movies</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <span className="text-light me-3">Hi, {user.name}</span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                <Button as={Link} to="/register" variant="danger" size="sm">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;