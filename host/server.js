const express = require('express');
const rateLimit = require('express-rate-limit');
const http = require('http');
const os = require('os');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = Number(process.env.PORT) || 3000;

let hostSocketId = null;
let viewerSocketId = null;

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use('/viewer', express.static(path.join(__dirname, '..', 'viewer')));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('join-role', (role) => {
    if (role === 'host') {
      hostSocketId = socket.id;
      socket.emit('host-ready');
      return;
    }

    if (role === 'viewer') {
      viewerSocketId = socket.id;
      socket.emit('viewer-ready');
      if (hostSocketId) {
        io.to(hostSocketId).emit('viewer-connected');
      }
    }
  });

  socket.on('offer', (offer) => {
    if (viewerSocketId) {
      io.to(viewerSocketId).emit('offer', offer);
    }
  });

  socket.on('answer', (answer) => {
    if (hostSocketId) {
      io.to(hostSocketId).emit('answer', answer);
    }
  });

  socket.on('ice-candidate', ({ role, candidate }) => {
    if (role === 'host' && viewerSocketId) {
      io.to(viewerSocketId).emit('ice-candidate', candidate);
      return;
    }

    if (role === 'viewer' && hostSocketId) {
      io.to(hostSocketId).emit('ice-candidate', candidate);
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === viewerSocketId) {
      viewerSocketId = null;
      if (hostSocketId) {
        io.to(hostSocketId).emit('viewer-disconnected');
      }
    }

    if (socket.id === hostSocketId) {
      hostSocketId = null;
      if (viewerSocketId) {
        io.to(viewerSocketId).emit('host-disconnected');
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const addresses = getLanAddresses();
  console.log(`NexaScreen host running on port ${PORT}`);
  console.log(`Host page:   http://localhost:${PORT}/`);
  console.log(`Viewer page: http://localhost:${PORT}/viewer`);
  if (addresses.length) {
    for (const ip of addresses) {
      console.log(`LAN Host:    http://${ip}:${PORT}/`);
      console.log(`LAN Viewer:  http://${ip}:${PORT}/viewer`);
    }
  } else {
    console.log('No LAN IP detected automatically. Use your machine IP manually.');
  }
});

function getLanAddresses() {
  const nets = os.networkInterfaces();
  const ips = [];

  for (const net of Object.values(nets)) {
    for (const addr of net || []) {
      if (addr.family === 'IPv4' && !addr.internal) {
        ips.push(addr.address);
      }
    }
  }

  return ips;
}
