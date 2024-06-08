// require websocket npm module
const WebSocket = require('ws');

// port 5000 connection
const wss = new WebSocket.Server({ port: 5000 });

wss.on('connection', (ws) => {
  const broadCastHanlder = (msg) => {
    wss.clients.forEach(function each(client, i) {
      // prevent send msg self
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  };

  // listening message from client
  ws.on('message', (res) => {
    const { type, data, id } = JSON.parse(res);
    switch (type) {
      case 'id':
        broadCastHanlder(JSON.stringify({ type: 'welcome', data }));
        break;
      case 'msg':
        broadCastHanlder(JSON.stringify({ type: 'other', data, id }));
        break;
      default:
        break;
    }
  });

  ws.on('close', () => {
    console.log('client has disconnected');
  });
});
