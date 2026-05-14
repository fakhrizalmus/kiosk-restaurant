require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const router = require('./routes/index');
const { getSocketCorsOptions, registerSocketHandlers } = require('./socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'SECRET_SESSION_KEY';
const sameSite = isProduction ? 'none' : false;

const io = new Server(server, {
  cors: getSocketCorsOptions(),
  pingTimeout: 20000,
  pingInterval: 25000,
});

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', router);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get('/', (req, res) => {
  res.send('halo');
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`dengar di ${PORT}`);
});
