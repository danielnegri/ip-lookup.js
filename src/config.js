// Load environment variables from `.env` file.
// A sample configuration file is included: .env.example
const envFound = require('dotenv').config();

if (!envFound && !process.env.IP2LOCATION_KEY) {
  console.error(
    '⚠️  No .env file found for this project: this file contains' +
      'your server port and other variables.\nTry copying .env.example to .env' +
      '(and make sure to include your custom values!) or export environment variable IP2LOCATION_KEY.'
  );
  process.exit(1);
}

module.exports = {
  CACHE_TTL: process.env.CACHE_TTL || 3600,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  IP2LOCATION_KEY: process.env.IP2LOCATION_KEY,
  IP2LOCATION_RATE_PER_SECOND: process.env.IP2LOCATION_RATE_PER_SECOND || 10,
  IP2LOCATION_TIMEOUT: process.env.IP2LOCATION_TIMEOUT || 10000,
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3000,
};
