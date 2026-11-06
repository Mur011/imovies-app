import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import io from 'socket.io-client';
import API from '../services/api';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const BookingPage = ({ user }) => {
  const { id } = useParams(); // Movie ID
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]); // seats held by others
  const [loading, setLoading] = useState(true);
  const [bookingMessage, setBookingMessage] = useState({ text: '', type: '' });

  // 1. Fetch movie details and available shows
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const movieRes = await API.get(`/movies/${id}`);
        const showsRes = await API.get(`/shows/movie/${id}`);
        setMovie(movieRes.data);
        setShows(showsRes.data);
        if (showsRes.data.length > 0) {
          setSelectedShow(showsRes.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. Real-time socket room synchronization
  useEffect(() => {
    if (!selectedShow) return;

    // Join room for this specific show
    socket.emit('joinShow', selectedShow._id);
    setSelectedSeats([]);
    setLockedSeats([]);

    socket.on('seatLocked', ({ seatNumber }) => {
      setLockedSeats((prev) => [...prev, seatNumber]);
    });

    socket.on('seatReleased', ({ seatNumber }) => {
      setLockedSeats((prev) => prev.filter((s) => s !== seatNumber));
    });

    return () => {
      socket.off('seatLocked');
      socket.off('seatReleased');
    };
  }, [selectedShow]);

  // Handle seat clicks
  const toggleSeat = (seat) => {
    if (seat.status === 'booked' || lockedSeats.includes(seat.seatNumber)) return;

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNumber));
      socket.emit('releaseSeat', { showId: selectedShow._id, seatNumber: seat.seatNumber });
    } else {
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
      socket.emit('selectSeat', { showId: selectedShow._id, seatNumber: seat.seatNumber, userId: user?.id });
    }
  };

  // Handle Checkout
  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (selectedSeats.length === 0) return;

    try {
      const totalAmount = selectedSeats.length * selectedShow.ticketPrice;
      await API.post('/bookings', {
        showId: selectedShow._id,
        seatNumbers: selectedSeats,
        totalAmount
      });

      setBookingMessage({ text: 'Booking Confirmed! Enjoy your movie.', type: 'success' });
      // Update local seat status
      setSelectedShow((prev) => ({
        ...prev,
        seats: prev.seats.map((s) =>
          selectedSeats.includes(s.seatNumber) ? { ...s, status: 'booked' } : s
        )
      }));
      setSelectedSeats([]);
    } catch (err) {
      setBookingMessage({
        text: err.response?.data?.message || 'Booking failed. Try again.',
        type: 'danger'
      });
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {bookingMessage.text && (
        <Alert variant={bookingMessage.type} dismissible onClose={() => setBookingMessage({ text: '', type: '' })}>
          {bookingMessage.text}
        </Alert>
      )}

      {movie && (
        <div className="d-flex align-items-center mb-4">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '6px' }}
            className="me-3 shadow-sm"
          />
          <div>
            <h3 className="fw-bold mb-1">{movie.title}</h3>
            <p className="text-muted mb-0">{movie.genre.join(', ')} • {movie.duration} min • {movie.language}</p>
          </div>
        </div>
      )}

      {/* Show Selection */}
      <Card className="p-3 mb-4 shadow-sm border-0">
        <h5 className="fw-bold mb-3">Select Cinema & Show Time</h5>
        <div className="d-flex flex-wrap gap-2">
          {shows.map((show) => (
            <Button
              key={show._id}
              variant={selectedShow?._id === show._id ? 'danger' : 'outline-dark'}
              onClick={() => setSelectedShow(show)}
            >
              {show.theatre?.name} ({show.time}) — ₹{show.ticketPrice}
            </Button>
          ))}
        </div>
      </Card>

      {/* Seat Layout Grid */}
      {selectedShow && (
        <Card className="p-4 shadow-sm border-0 text-center">
          {/* Cinema Screen Indicator */}
          <div
            className="mx-auto mb-4 bg-dark text-light rounded py-1"
            style={{ width: '60%', letterSpacing: '4px', fontSize: '13px' }}
          >
            CINEMA SCREEN THIS WAY
          </div>

          <div
            className="mx-auto mb-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 42px)',
              gap: '8px',
              justifyContent: 'center'
            }}
          >
            {selectedShow.seats.map((seat) => {
              const isSelected = selectedSeats.includes(seat.seatNumber);
              const isLocked = lockedSeats.includes(seat.seatNumber);
              const isBooked = seat.status === 'booked';

              let btnVariant = 'outline-secondary';
              if (isBooked) btnVariant = 'secondary';
              else if (isLocked) btnVariant = 'warning';
              else if (isSelected) btnVariant = 'danger';

              return (
                <button
                  key={seat.seatNumber}
                  disabled={isBooked || isLocked}
                  onClick={() => toggleSeat(seat)}
                  className={`btn btn-sm ${isSelected ? 'btn-danger' : isBooked ? 'btn-secondary disabled' : isLocked ? 'btn-warning' : 'btn-outline-dark'}`}
                  style={{
                    width: '42px',
                    height: '38px',
                    fontSize: '11px',
                    padding: 0,
                    fontWeight: 'bold',
                    cursor: isBooked || isLocked ? 'not-allowed' : 'pointer'
                  }}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>

          {/* Seat Legend */}
          <div className="d-flex justify-content-center gap-4 mb-4 small">
            <div><Badge bg="outline-dark" className="border text-dark me-1">□</Badge> Available</div>
            <div><Badge bg="danger" className="me-1">■</Badge> Selected</div>
            <div><Badge bg="warning" text="dark" className="me-1">■</Badge> Locked by other</div>
            <div><Badge bg="secondary" className="me-1">■</Badge> Booked</div>
          </div>

          {/* Checkout Summary */}
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <div className="text-start">
              <h6 className="mb-0">Selected: <strong>{selectedSeats.join(', ') || 'None'}</strong></h6>
              <small className="text-muted">Total: ₹{selectedSeats.length * selectedShow.ticketPrice}</small>
            </div>
            <Button
              variant="danger"
              size="lg"
              disabled={selectedSeats.length === 0}
              onClick={handleBooking}
            >
              Confirm Booking (₹{selectedSeats.length * selectedShow.ticketPrice})
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default BookingPage;