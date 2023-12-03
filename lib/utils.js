const lib = {};

lib.createRes = (success, error, data, errorType) => ({
  success,
  error,
  data,
  errorType,
});

/**
 *  Catches exceptions and passes it to express
 *  Converts synthetic errors to response
 *  Works like stacked middleware
 *  @param {(req: import('express').Request, res: import('express').Response, next: (...args: any[])=> void) => Promise<any> | any} handler
 *  @returns {(req: import('express').Request, res: import('express').Response, next: (error?: Error)) => void}
 */
lib.expressRoute = (handler) => async (req, res, next) => {
  try {
    let isNextCalled = false;
    const data = await handler(req, res, (...args) => {
      isNextCalled = true;
      next(...args);
    });
    if (isNextCalled) {
      return;
    }
    if (!res.headersSent) {
      // eslint-disable-next-line consistent-return
      return res.json(lib.createRes(true, null, data || true));
    }
  } catch (error) {
    if (error.isApiException) {
      Object.assign(res, {
        apiError: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          context: error.getContext(),
        },
      });
      // eslint-disable-next-line consistent-return
      return res.status(error.statusCode).json(error.createRes());
    }
    Object.assign(res, {
      apiError: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
    // eslint-disable-next-line consistent-return
    return next(error);
  }
};

module.exports = lib;
