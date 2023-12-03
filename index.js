const config = require('./lib/config');
const db = require('./lib/db');
const { applicationLogger: logger } = require('./lib/logger');

async function main() {
  await db.authenticate();
  /* eslint-disable global-require */
  const server = require('./server');
  // sync db when models have been required
  await db.sync({
    // force: true,
  });
  server.listen(config.port);
}

main()
  .then(() => {
    // logger.info(config);
    logger.info('Application online');
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });

process.on('uncaughtException', (err) => {
  logger.error(err);
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
});
