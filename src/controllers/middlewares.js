const jwt = require('jsonwebtoken');
const config = require('../../lib/config');
const generalExceptions = require('../../lib/generalExceptions');
const { applicationLogger: log } = require('../../lib/logger');

function verifyWebServerToken(req, res, next) {
  const tokenStr = req.headers.authorization;
  if (!tokenStr) {
    throw new generalExceptions.AuthenticationDenied(
      'AUTH_ERR_0001',
      'Token required'
    );
  }
  const elems = tokenStr.split(' ');
  if (elems.length !== 2) {
    throw new generalExceptions.AuthenticationDenied(
      'AUTH_ERR_0002',
      'Invalid token format'
    );
  }
  const token = elems[1];
  try {
    const payload = jwt.verify(token, config.webServerSecret);
    req.apiUser = {
      clientId: payload.clientId,
    };
    return next();
  } catch (err) {
    log.error(err);
    throw new generalExceptions.AuthenticationDenied(
      'AUTH_ERR_0003',
      'Invalid token'
    );
  }
}

function verifyUserToken(req, res, next) {
  const tokenStr = req.headers.authorization;
  if (!tokenStr) {
    throw new generalExceptions.AuthenticationDenied(
      'AUTH_ERR_0004',
      'Token required'
    );
  }
  const elems = tokenStr.split(' ');
  if (elems.length !== 2) {
    throw new generalExceptions.AuthenticationDenied(
      'AUTH_ERR_0005',
      'Invalid token format'
    );
  }
  const token = elems[1];
  try {
    const payload = jwt.verify(token, config.userApiSecret);
    req.user = payload.user || {};
    return next();
  } catch (err) {
    log.error(err);
    throw new generalExceptions.AuthenticationDenied(
      'AUTH_ERR_0006',
      'Invalid token'
    );
  }
}

module.exports = {
  verifyWebServerToken,
  verifyUserToken,
};
