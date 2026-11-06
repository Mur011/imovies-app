import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="p-4 shadow-sm border-0">
        <h3 className="text-center mb-4 fw-bold">Create Account</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </Form.Group>
          <Button variant="danger" type="submit" className="w-100 fw-bold">
            Sign Up
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small>Already have an account? <Link to="/login">Sign In</Link></small>
        </div>
      </Card>
    </Container>
  );
};

export default Register;