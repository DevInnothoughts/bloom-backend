const express = require('express');
const cors = require('cors');
const { applicationLogger: logger, requestLogger } = require('./lib/logger');
const config = require('./lib/config');
const db = require('./lib/db');
const routes = require('./src/routes/v2');

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (config.corsWhitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
// logger middleware
app.use((req, res, next) => {
  const requestMethod = req.method;
  const contentLength = req.header['content-length'];
  const { url } = req;
  req.requestId =
    req.headers['x-amzn-trace-id'] ||
    `id-${Math.floor(100000 + Math.random() * 900000)}`;

  requestLogger.info({
    'user-agent': req.headers['user-agent'],
    message: {
      method: requestMethod,
      contentLength,
      requestId: req.requestId,
      url,
      headers: {
        host: req.headers.host,
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-forwarded-proto': req.headers['x-forwarded-proto'],
        'x-forwarded-port': req.headers['x-forwarded-port'],
      },
    },
  });
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'From bloom backend' });
});
app.use('/v2', routes);
app.get('/health', async (req, res) => {
  try {
    await db.authenticate(); // tries to run SELECT 1+1 AS result
    return res.json({
      data: { db: true },
    });
  } catch (error) {
    logger.error(error);
    return res.json({
      data: { db: false },
    });
  }
});

app.use((req, res) => res.status(404).json({}));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.fatal(err.message);
  res.status(500).json({ success: false, error: 'Internal error' });
});

module.exports = app;
