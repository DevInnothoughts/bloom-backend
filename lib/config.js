const { env } = process;

const config = {
  port: env.PORT,
  applicationName: env.APPLICATION_NAME,
  environment: env.ENVIRONMENT,
  db: {
    connection: {
      user: env.DB_USER,
      url: env.DB_URL,
      host: env.DB_URL,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      port: env.DB_PORT,
      dialect: env.DB_DIALECT,
    },
  },
  corsWhitelist: env.APP_URLS
    ? env.APP_URLS.split(',').map((appUrl) => appUrl.trim())
    : [],
};

module.exports = config;
