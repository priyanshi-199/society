const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes');
const requestLogger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins =
  (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const defaultOrigins = ['http://localhost:5173'];
const originWhitelist = allowedOrigins.length ? allowedOrigins : defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || originWhitelist.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(compression());
app.use(requestLogger());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;

