const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

BookingSchema.index({ user: 1, show: 1 });

module.exports = mongoose.model('Booking', BookingSchema);