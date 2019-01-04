const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const { getDrones } = require('./routes/controller');

const dbName = process.env.NODE_ENV === 'dev' ? 'database-test' : 'database';
const url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${dbName}:27017/dbName?authMechanism=SCRAM-SHA-1&authSource=admin`;
const options = {
  useNewUrlParser: true,
  reconnectTries: 60,
  reconnectInterval: 1000,
};


const port = process.env.PORT || 4001;
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);

app.use((req, res) => {
  res.status(404);
});

const server = http.createServer(app);
const io = socketIo(server);

const getApiAndEmit = async (socket, req) => {
  try {
    const res = await getDrones(req, null, null);
    socket.emit('FromAPI', res);
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
  const req = { app };
  interval = setInterval(() => getApiAndEmit(socket, req), 10000);
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
