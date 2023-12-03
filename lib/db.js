const { Sequelize } = require('sequelize');
const config = require('./config');
const { sequelizeLogger } = require('./logger');

const { connection: dbConfig } = config.db;

const db = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: `${dbConfig.host}`,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: (msg) => sequelizeLogger.info(msg),
});

module.exports = db;
