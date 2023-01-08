const querystring = require('querystring');
const axios = require('axios');
const { RateLimiter } = require('limiter');

const { IP2LOCATION_URL } = require('../../constants');
const logger = require('../../logger');

class IP2Location {
  /**
   * Create an instance of IP2Location
   *
   * @param {String} apiKey The API key
   * @param {Object} rateLimit The amount of tokens per second limitation
   *
   * @returns {Axios} A new instance of IP2Location
   */
  constructor(apiKey, rateLimit) {
    if (!apiKey) {
      throw Error('The "IP2LOCATION_KEY" environment variable is required');
    }

    this.apiKey = apiKey;
    this.limiter = new RateLimiter({
      tokensPerInterval: rateLimit,
      day: 'second',
    });
  }

  /**
   * Lookup IPv4 and IPv6 addresses.
   * For more information: https://www.ip2location.io/ip2location-documentation
   *
   * @param {String} ip The IP address
   *
   * @returns {String} The associated country name
   */
  async lookup(ip) {
    logger.info(`IP2Location Lookup ${ip}`);

    if (!this.limiter.tryRemoveTokens(1)) {
      throw new Error('Exceeded quota');
    }

    const query = querystring.stringify({
      ip,
      key: this.apiKey,
    });

    const { country_name } = await axios({
      url: `${IP2LOCATION_URL}/?${query}`,
      method: 'GET',
      'Content-Type': 'application/json',
    })
      .then((result) => {
        return result.data;
      })
      .catch((err) => {
        logger.error(`Failed to lookup IP ${ip}`, err);
        throw err;
      });

    return { country_name };
  }
}

module.exports = IP2Location;
