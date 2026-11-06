const Movie = require('../models/Movie');

// 1. Get all movies with search & genre/language filter
exports.getMovies = async (req, res) => {
  try {
    const { search, genre, language } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (genre) {
      query.genre = { $in: [genre] };
    }
    if (language) {
      query.language = { $regex: language, $options: 'i' };
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get single movie details
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Create a movie (Admin only)
exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. Delete a movie (Admin only)
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};