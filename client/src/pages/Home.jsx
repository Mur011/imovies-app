import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (searchQuery = '') => {
    try {
      setLoading(true);
      const res = await API.get(`/movies${searchQuery ? `?search=${searchQuery}` : ''}`);
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(search);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Now Showing</h2>
        <Form onSubmit={handleSearch} className="d-flex" style={{ maxWidth: '350px' }}>
          <Form.Control
            type="search"
            placeholder="Search movies..."
            className="me-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline-dark" type="submit">Search</Button>
        </Form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : movies.length === 0 ? (
        <p className="text-muted text-center py-5">No movies found.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {movies.map((movie) => (
            <Col key={movie._id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={movie.posterUrl}
                  alt={movie.title}
                  style={{ height: '320px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-bold text-truncate">{movie.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted small">
                      {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre} | {movie.duration}m
                    </Card.Subtitle>
                    <Card.Text className="small text-secondary" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {movie.description}
                    </Card.Text>
                  </div>
                  <Button
                    as={Link}
                    to={`/movie/${movie._id}`}
                    variant="danger"
                    className="w-100 mt-3"
                  >
                    Book Tickets
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;