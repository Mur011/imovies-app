const Show = require('../models/Show');
const Theatre = require('../models/Theatre');

// 1. Get all shows for a specific movie
exports.getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({ movie: movieId })
      .populate('theatre')
      .populate('movie');
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get specific show details with current seat layout
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('theatre')
      .populate('movie');
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Create a theatre and show with 60 seats (Admin)
exports.createShowWithTheatre = async (req, res) => {
  try {
    const { theatreName, city, screenNumber, movieId, showTime, ticketPrice } = req.body;

    let theatre = await Theatre.findOne({ name: theatreName, city });
    if (!theatre) {
      theatre = await Theatre.create({
        name: theatreName,
        city: city || 'Indore',
		location: city || 'Indore',
        screens: [{ screenNumber: screenNumber || 1, totalSeats: 60 }]
      });
    }

    // Generate standard 6-row x 10-column seating (A1..A10 to F1..F10)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seats = [];

    rows.forEach(row => {
      for (let num = 1; num <= 10; num++) {
        seats.push({
          seatNumber: `${row}${num}`,
          row: row,
          price: ticketPrice || 250,
          status: 'available'
        });
      }
    });

    const newShow = await Show.create({
      movie: movieId,
      theatre: theatre._id,
      screenNumber: screenNumber || 1,
      date: date || new Date(),
      time: time || '19:00',
      ticketPrice: ticketPrice || 250,
      seats: seats
    });

    res.status(201).json({ message: 'Show created successfully', show: newShow });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};