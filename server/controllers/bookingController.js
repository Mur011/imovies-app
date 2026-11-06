const Booking = require('../models/Booking');
const Show = require('../models/Show');

// 1. Create a booking and mark seats as booked
exports.createBooking = async (req, res) => {
  try {
    const { showId, seatNumbers, totalAmount } = req.body;
    const userId = req.user.id;

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Verify all requested seats are currently available
    const unavailableSeats = show.seats.filter(
      (s) => seatNumbers.includes(s.seatNumber) && s.status === 'booked'
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some of the selected seats are already booked',
        seats: unavailableSeats.map((s) => s.seatNumber)
      });
    }

    // Mark seats as booked
    show.seats.forEach((seat) => {
      if (seatNumbers.includes(seat.seatNumber)) {
        seat.status = 'booked';
      }
    });
    await show.save();

    // Create booking record
    const booking = await Booking.create({
      user: userId,
      show: showId,
      seats: seatNumbers,
      totalAmount,
      paymentStatus: 'completed'
    });

    res.status(201).json({
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get user's booking history
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl duration' },
          { path: 'theatre', select: 'name city' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};