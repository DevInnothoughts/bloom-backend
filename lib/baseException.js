const { createRes } = require('./utils');

class BaseExpection extends Error {
  /**
   *
   * @param {string} message
   * @param {string} errorCode
   * @param {string} statusCode
   * @param {string} errorType
   * @param {Object} meta
   */
  constructor(message, errorCode, statusCode, errorType, meta) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isApiException = true;
    this.errorType = errorType;
    this.meta = meta;
  }

  createRes() {
    return createRes(false, this.message, null, this.errorType);
  }

  getContext() {
    return {
      type: this.errorType,
      code: this.errorCode,
      meta: this.meta,
    };
  }
}

module.exports = BaseExpection;
