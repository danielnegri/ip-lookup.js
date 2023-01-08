const logger = require('../logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  logger.error(err);

  // Authentication failure
  if (err.authFailed) {
    return res.status(401).json(toJSON(err));
  }

  // Not found error
  if (err.notFound) {
    return res.status(404).json(toJSON(err));
  }

  // Forbidden to access content
  if (err.forbidden) {
    return res.status(403).json(toJSON(err));
  }

  // Default error message
  if (!err.clientMessage) {
    err.clientMessage = 'An internal error occurred.';
  }

  // Default to 500
  if (!err.status) {
    err.status = 500;
  }

  return res.status(err.status).json(toJSON(err));
};

// Generate JSON to include in the response object
function toJSON(err) {
  return {
    error: err.status,
    message: err.clientMessage,
  };
}