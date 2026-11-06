const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Show = require('./models/Show');

dotenv.config();

const seedShows = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear old shows and theatres
    await Show.deleteMany({});
    await Theatre.deleteMany({});

    const movies = await Movie.find();
    if (movies.length === 0) {
      console.log('No movies found. Run node seed.js first.');
      process.exit();
    }

    const theatre = await Theatre.create({
      name: 'PVR Velocity Cinemas',
      city: 'Indore',
      location: 'Indore',
      screens: [{ screenNumber: 1, totalSeats: 60 }]
    });

    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const generateSeats = () => {
      const seats = [];
      rows.forEach(r => {
        for (let i = 1; i <= 10; i++) {
          seats.push({
            seatNumber: `${r}${i}`,
            row: r,
            price: 250,
            status: 'available'
          });
        }
      });
      return seats;
    };

    for (const movie of movies) {
      await Show.create({
        movie: movie._id,
        theatre: theatre._id,
        screenNumber: 1,
        date: new Date(),
        time: '19:00',
        ticketPrice: 250,
        seats: generateSeats()
      });
    }

    console.log('Shows and seat layouts seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedShows();