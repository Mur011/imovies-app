const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  screenNumber: { type: Number, default: 1 },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  seats: [{
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

ShowSchema.index({ movie: 1, date: 1, theatre: 1 });

module.exports = mongoose.model('Show', ShowSchema);