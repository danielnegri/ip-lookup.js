// Load environment variables from `.env` file.
// A sample configuration file is included: .env.example
const envFound = require('dotenv').config();

if (!envFound) {
  console.log(
    '⚠️  No .env file found for this project: this file contains' +
      'your server port and other variables.\nTry copying .env.example to .env' +
      '(and make sure to include your custom values!)'
  );
  process.exit(0);
}

module.exports = {
  cache_ttl: process.env.CACHE_TTL || 3600,
  environment: process.env.NODE_ENV || 'development',
  log_level: process.env.LOG_LEVEL || 'debug',
  port: process.env.PORT || 3000,
};
