/* eslint-disable no-param-reassign */
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Drone = require('./models/Drone');
const cors = require('cors');

const dbName = process.env.NODE_ENV === 'dev' ? 'database-test' : 'database';
const url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${dbName}:27017/dbName?authMechanism=SCRAM-SHA-1&authSource=admin`;
const options = {
  useNewUrlParser: true,
  reconnectTries: 60,
  reconnectInterval: 1000,
};
const possibleMovements = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
const getNewCoordinate = () => possibleMovements[Math.floor(Math.random() * possibleMovements.length)];

const port = process.env.PORT || 4001;
const routes = require('./routes');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);

app.use((req, res) => {
  res.status(404);
});

const server = http.createServer(app);
const io = socketIo(server);

const getApiAndEmit = async (socket) => {
  try {
    Drone.find()
      .then((drones) => {
        drones.forEach((drone) => {
          const { x, y } = drone;
          drone.x = Number(x) + getNewCoordinate();
          drone.y = Number(y) + getNewCoordinate();
        });
        Drone.updateMany(drones);
        socket.emit('FromAPI', drones);
      });
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

let interval;

io.on('connection', (socket) => {
  console.log('New client connected');
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

mongoose.connect(url, options).then(() => {
  console.log('Successfully connected to the database');
}).catch((err) => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

server.listen(port, () => console.log(`Listening on port ${port}`));
