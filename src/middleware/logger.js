const morgan = require('morgan');

const logger = require('../logger');

const stream = {
  // Use the http severity
  write: (message) => logger.http(message),
};

const loggerMiddleware = morgan(
  ':remote-addr :method :url status=:status content-length=:res[content-length] response-time=:response-time ms',
  { stream }
);

module.exports = loggerMiddleware;
