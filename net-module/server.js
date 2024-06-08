// require net module
const net = require('net');

// create TCP server
const server = net.createServer((socket) => {
  // 'data' type listening from client
  socket.on('data', (data) => {
    console.log('From client:', data.toString());
  });
  // 'close' net module client when socket closed by client
  socket.on('close', () => {
    console.log('client disconnected.');
  });
  // welcome message
  socket.write('welcome to server');
});

server.on('error', (err) => {
  console.log('err' + err);
});

// port-5000
server.listen(5000, () => {
  console.log('listening on 5000');
});
