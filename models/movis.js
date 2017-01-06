const mongoose = require('mongoose');
const movieSchema = require('../schemas/movie.js');
const Movie = mongoose.model('Movie',movieSchema);

module.exports = Movie