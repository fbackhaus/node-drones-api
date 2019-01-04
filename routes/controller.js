const Drone = require('../models/Drone');

const generateId = () => Math.random().toString(36).substring(7);

exports.getDrones = function getDrones(req, res, next) {
  Drone.find()
    .then((drones) => {
      res.send(drones);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving drones.',
      });
    });
};

exports.createDrone = function createDrone(req, res, next) {
  const drone = new Drone({
    x: req.body.x,
    y: req.body.y,
    quadrant: req.body.quadrant,
    id: generateId(),
  });

  drone.save()
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Drone.',
      });
    });
};
