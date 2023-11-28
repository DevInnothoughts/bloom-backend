/* eslint max-classes-per-file: 0 */
const BaseException = require('./baseException');

class PermissionDenied extends BaseException {
  /**
   * @param {string} errorCode unique error code
   * @param {string} message detailed error message
   * @param {Object} meta metadata
   */
  constructor(errorCode, message) {
    const statusCode = 403;
    const errorType = 'PermissionException';
    super(message, errorCode, statusCode, errorType);
  }
}

class ValidationError extends BaseException {
  /**
   * @param {string} errorCode unique error code
   * @param {string} message detailed error message
   * @param {Object} meta metadata
   */
  constructor(errorCode, message) {
    const errorType = 'InputException';
    const statusCode = 400;
    super(message, errorCode, statusCode, errorType);
  }
}

class ResourceNotFound extends BaseException {
  /**
   * @param {string} errorCode unique error code
   * @param {string} message detailed error message
   * @param {Object} meta metadata
   */
  constructor(errorCode, message, meta) {
    const errorType = 'InputException';
    const statusCode = 404;
    super(message, errorCode, statusCode, errorType, meta);
  }
}

class ExpectationFailed extends BaseException {
  /**
   * @param {string} errorCode unique error code
   * @param {string} message detailed error message
   * @param {Object} meta metadata
   */
  constructor(errorCode, message, meta) {
    const errorType = 'StateException';
    const statusCode = 412;
    super(message, errorCode, statusCode, errorType, meta);
  }
}

class ExternalServiceFailed extends BaseException {
  /**
   * @param {string} errorCode unique error code
   * @param {string} message detailed error message
   * @param {Object} meta metadata
   */
  constructor(errorCode, message, meta) {
    const errorType = 'ExternalServiceError';
    const statusCode = 500;
    super(message, errorCode, statusCode, errorType, meta);
  }
}

module.exports.ValidationError = ValidationError;
module.exports.ExpectationFailed = ExpectationFailed;
module.exports.ResourceNotFound = ResourceNotFound;
module.exports.PermissionDenied = PermissionDenied;
module.exports.ExternalServiceFailed = ExternalServiceFailed;
