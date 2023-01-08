const morgan = require('morgan');

const logger = require('../logger');

const stream = {
  // Use the http severity
  write: (message) => logger.http(message),
};

const loggerMiddleware = morgan(
  ':remote-addr :method :url status=:status content-length=:res[content-length] - response-time=:response-time ms', // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream }
);

module.exports = loggerMiddleware;
