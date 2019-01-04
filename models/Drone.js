const mongoose = require('mongoose');

const DroneSchema = mongoose.Schema({
  x: String,
  y: String,
  quadrant: String,
  id: String,
});

module.exports = mongoose.model('Drone', DroneSchema);
