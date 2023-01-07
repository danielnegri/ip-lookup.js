const express = require('express');

const indexRouter = require('./routes/index');
const errors = require('./middleware/errors');
const loggerMiddleware = require('./middleware/logger');

const app = express();
app
  .use(loggerMiddleware)
  // Parse JSON
  .use(express.json())
  // Enable routes
  .use('/', indexRouter)

  // Error middleware
  .use(errors);

module.exports = app;
