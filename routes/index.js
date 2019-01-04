const router = require('express').Router();
const { getDrones, createDrone } = require('./controller');

router.get('/drones', (req, res, next) => getDrones(req, res, next));

router.post('/drones', (req, res, next) => createDrone(req, res, next));

module.exports = router;
