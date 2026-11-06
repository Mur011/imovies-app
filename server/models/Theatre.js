const mongoose = require('mongoose');

const TheatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  totalScreens: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Theatre', TheatreSchema);