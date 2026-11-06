const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: [String], required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  posterUrl: { type: String, default: '' }
}, { timestamps: true });

MovieSchema.index({ title: 'text', genre: 'text', language: 'text' });

module.exports = mongoose.model('Movie', MovieSchema);