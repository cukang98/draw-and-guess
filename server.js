const express = require('express');
const next = require('next');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { setupSocket } = require('./server/socket');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3006', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  setupSocket(io);

  expressApp.all('*', (req, res) => handle(req, res));

  httpServer.listen(port, () => {
    console.warn(`> Ready on http://${hostname}:${port}`);
  });
});
