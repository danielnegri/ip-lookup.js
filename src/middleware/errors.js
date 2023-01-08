// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  return res.status(err.statusCode).json(toJSON(err));
};

// Generate JSON to include in the response object
function toJSON(err) {
  const result = {
    message: err.message,
    status_code: err.statusCode,
  };

  if (err.details) {
    result.details = err.details;
  }

  return result;
}
