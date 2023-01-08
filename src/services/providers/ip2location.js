const querystring = require('querystring');
const axios = require('axios');
const { RateLimiter } = require('limiter');

const { IP2LOCATION_URL } = require('../../constants');
const { IP2LOCATION_KEY, IP2LOCATION_RATE_PER_SECOND } = require('../../config');
const logger = require('../../logger');

// Free ip2location plan is restricted to 30,000 requests per month.
const limiter = new RateLimiter({
  tokensPerInterval: IP2LOCATION_RATE_PER_SECOND,
  day: 'second',
});

// Lookup returns the associated country name of an IP.
// It requires the API key and supports both IPv4 and IPv6 addresses.
// For more information: https://www.ip2location.io/ip2location-documentation
async function lookup(ip) {
  logger.info(`IP2Location: Lookup ${ip}`);

  if (!limiter.tryRemoveTokens(1)) {
    throw new Error('Exceeded quota');
  }

  const query = querystring.stringify({
    ip,
    key: IP2LOCATION_KEY,
  });

  return axios({
    url: `${IP2LOCATION_URL}/?${query}`,
    method: 'GET',
    'Content-Type': 'application/json',
  }).then((response) => {
    logger.info(response);
  });
}

module.exports = lookup;
