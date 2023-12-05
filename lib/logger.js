// doc - https://github.com/pinojs/pino/blob/master/docs/api.md

const pino = require('pino');

const config = require('./config');
const { loggerTypes } = require('./constants');

const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  name: config.applicationName,
});

function getChildLogger(loggerType) {
  const childLogger = logger.child({ type: loggerType });
  return childLogger;
}

module.exports = {
  logger,
  applicationLogger: getChildLogger(loggerTypes.APPLICATION),
  integrationsLogger: getChildLogger(loggerTypes.INTEGRATIONS),
  requestLogger: getChildLogger(loggerTypes.REQUEST),
  responseLogger: getChildLogger(loggerTypes.RESPONSE),
  sequelizeLogger: getChildLogger(loggerTypes.SEQUELIZE),
};
