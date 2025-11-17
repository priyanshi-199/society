const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes');
const requestLogger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* -----------------------------------------
   CORS CONFIGURATION (FIXED)
------------------------------------------ */

// Add your Vercel frontend domain here
const defaultOrigins = [
  'http://localhost:5173',
  'https://society-beio-ed38k5x6k-priyanshi-bhanges-projects.vercel.app',
  'https://society-4v8u.vercel.app'
];

// Read allowed origins from .env (Render)
const allowedOrigins =
  (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedSuffixes = (process.env.ALLOWED_ORIGIN_SUFFIXES || '')
  .split(',')
  .map((suffix) => suffix.trim())
  .filter(Boolean);

// Merge .env origins + defaults
const originWhitelist = [...new Set([...defaultOrigins, ...allowedOrigins])];

console.log('CORS Allowed Origins:', originWhitelist);
console.log('CORS Allowed Suffixes:', allowedSuffixes);

app.use(
  cors({
    origin(origin, callback) {
      // Allow REST tools / server-to-server requests (no origin)
      if (!origin || originWhitelist.includes(origin)) {
        return callback(null, true);
      }

      const matchesSuffix = allowedSuffixes.some((suffix) =>
        origin.endsWith(suffix),
      );

      if (matchesSuffix) {
        return callback(null, true);
      }

      console.error('❌ CORS BLOCKED:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

/* -----------------------------------------
   OTHER MIDDLEWARE
------------------------------------------ */

app.use(helmet());
app.use(compression());
app.use(requestLogger());
app.use(express.json({ limit: '50mb' })); // For large images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

/* -----------------------------------------
   HEALTH CHECK
------------------------------------------ */

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* -----------------------------------------
   API ROUTES
------------------------------------------ */

app.use('/api', routes);

/* -----------------------------------------
   ERROR HANDLER
------------------------------------------ */

app.use(errorHandler);

module.exports = app;
