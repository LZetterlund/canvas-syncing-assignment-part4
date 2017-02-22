"use strict";

const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// read the client html file into memory
// __dirname in node is the current directory
// (in this case the same folder as the server js file)
const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass in the http server into socketio and grab the webscoket server as io
const io = socketio(app);

const onJoined = (sock) => {
  const socket = sock;
  socket.on('join', () => {
    socket.join('room1');
  });
};

const update = (data) => {
  const x = data.x;
  const y = data.y;
  const height = data.height;
  const width = data.width;
  const imgData = data.imgData;

  io.sockets.in('room1').emit('draw', { x, y, height, width, imgData });
};

// const sendNumber = (sock) => {
//    const socket = sock;

//    socket.on('msgNumber', () => {
//        draws += 1;
//        const messageData = {
//            message: draws,
//        };
//        io.sockets.in('room1').emit('updateNum', messageData);
//    });
// };

io.sockets.on('connection', (socket) => {
  console.log('started');

  onJoined(socket);
  socket.on('update', (data) => {
    update(data);
  });
});

console.log('Websocket server started');
