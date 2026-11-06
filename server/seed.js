const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const sampleMovies = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
    genre: ['Sci-Fi', 'Action'],
    language: 'English',
    duration: 148,
    releaseDate: new Date('2010-07-16'),
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60'
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: ['Sci-Fi', 'Drama'],
    language: 'English',
    duration: 169,
    releaseDate: new Date('2014-11-07'),
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests.',
    genre: ['Action', 'Crime'],
    language: 'English',
    duration: 152,
    releaseDate: new Date('2008-07-18'),
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Movie.deleteMany({});
    await Movie.insertMany(sampleMovies);
    console.log('Sample movies seeded into MongoDB successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();