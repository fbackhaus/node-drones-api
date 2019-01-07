const router = require('express').Router();
const { getDrones, createDrone, deleteDrone } = require('./controller');

router.get('/drones', (req, res, next) => getDrones(req, res, next));

router.post('/drones', (req, res, next) => createDrone(req, res, next));

router.delete('/drones/:id', (req, res, next) => deleteDrone(req, res, next));

module.exports = router;
