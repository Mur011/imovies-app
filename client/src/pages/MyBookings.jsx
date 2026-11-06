import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Spinner, Row, Col } from 'react-bootstrap';
import API from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="fw-bold mb-4">My Booked Tickets</h3>
      {bookings.length === 0 ? (
        <Card className="p-4 text-center text-muted border-0 shadow-sm">
          No bookings found yet. Go book a movie!
        </Card>
      ) : (
        <Row className="g-3">
          {bookings.map((b) => (
            <Col md={6} key={b._id}>
              <Card className="border-0 shadow-sm p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-danger mb-0">{b.show?.movie?.title}</h5>
                  <Badge bg="success">Confirmed</Badge>
                </div>
                <p className="text-muted small mb-2">
                  {b.show?.theatre?.name} ({b.show?.theatre?.city})
                </p>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <div>
                    <span className="small text-muted d-block">Seats</span>
                    <strong>{b.seats.join(', ')}</strong>
                  </div>
                  <div className="text-end">
                    <span className="small text-muted d-block">Paid</span>
                    <strong className="text-success fs-5">₹{b.totalAmount}</strong>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings;