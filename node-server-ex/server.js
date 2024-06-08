// nodejs module require { 'http': sebserver, 'fs' file stream , 'url': request url parsing  }
const http = require('http');
const fs = require('fs').promises;
const url = require('url');

// create port5000 webserver
const server = http
  .createServer(async (req, res) => {
    // connecting url info parsing
    const pathname = url.parse(req.url).pathname;
    const method = req.method;
    let data = null;

    // req.method check
    if (method === 'GET') {
      switch (pathname) {
        case '/':
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
          data = await fs.readFile('./index.html');
          res.end(data);
          break;
        default:
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          data = await fs.readFile('./index.html');
          res.end(data);
          break;
      }
    }
  })
  .listen(5000);

// first fn executed
server.on('listening', () => {
  console.log('5000 port is running');
});

// error listener
server.on('error', (err) => {
  console.log(err);
});
