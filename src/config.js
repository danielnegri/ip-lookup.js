const assert = require('assert').strict;

// Load environment variables from `.env` file.
// A sample configuration file is included: .env.example
const envFound = require('dotenv').config();

if (!envFound) {
  console.error(
    '⚠️  No .env file found for this project: this file contains' +
      'your server port and other variables.\nTry copying .env.example to .env' +
      '(and make sure to include your custom values!)'
  );
  process.exit(1);
}

const IP2LOCATION_KEY = process.env.IP2LOCATION_KEY;
assert.ok(IP2LOCATION_KEY, 'The "IP2LOCATION_KEY" environment variable is required');

module.exports = {
  CACHE_TTL: process.env.CACHE_TTL || 3600,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  IP2LOCATION_KEY,
  IP2LOCATION_RATE_PER_SECOND: process.env.IP2LOCATION_RATE_PER_SECOND || 10,
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3000,
};
