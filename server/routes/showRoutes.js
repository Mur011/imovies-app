const express = require('express');
const router = express.Router();
const { getShowsByMovie, getShowById, createShowWithTheatre } = require('../controllers/showController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/movie/:movieId', getShowsByMovie);
router.get('/:id', getShowById);
router.post('/', protect, adminOnly, createShowWithTheatre);

module.exports = router;