const querystring = require('querystring');
const axios = require('axios');
const { RateLimiter } = require('limiter');

const { IP2LOCATION_URL } = require('../../constants');
const logger = require('../../logger');
const { IP2LOCATION_TIMEOUT } = require('../../config');
const { InternalServerError, TooManyRequestsError } = require('../../errors');

class IP2Location {
  /**
   * Create an instance of IP2Location
   *
   * @param {String} apiKey The API key
   * @param {Object} rateLimit The amount of tokens per second limitation
   * @param {Number} timeout The number of milliseconds before client request times out. (default: IP2LOCATION_TIMEOUT)
   *
   * @returns {Axios} A new instance of IP2Location
   */
  constructor(apiKey, rateLimit, timeout) {
    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      throw Error('The "IP2LOCATION_KEY" environment variable is required');
    }

    this.apiKey = apiKey;
    this.limiter = new RateLimiter({
      tokensPerInterval: rateLimit,
      interval: 'second',
    });

    this.timeout = timeout || IP2LOCATION_TIMEOUT;
    this.lookup = this.lookup.bind(this);
  }

  /**
   * Lookup IPv4 and IPv6 addresses.
   * For more information: https://www.ip2location.io/ip2location-documentation
   *
   * @param {String} ip The IP address
   * @param {AbortSignal} abortSignal The signal that allows to abort a request
   *
   * @returns {String} The associated country name
   */
  async lookup(ip, abortSignal) {
    logger.info(`IP2Location - Lookup ${ip}`);

    const limiter = this.limiter;
    if (!limiter.tryRemoveTokens(1)) {
      return Promise.reject(new TooManyRequestsError('Exceeded quota'));
    }

    const query = querystring.stringify({
      ip,
      key: this.apiKey,
    });

    const { country_name } = await axios({
      url: `${IP2LOCATION_URL}/?${query}`,
      method: 'GET',
      'Content-Type': 'application/json',
      signal: abortSignal,
      timeout: this.timeout,
    })
      .then((result) => result.data)
      .catch((err) => {
        logger.error(`IP2Location - Failed to lookup IP ${ip}`, err);
        return Promise.reject(new InternalServerError());
      });

    return { country_name };
  }
}

module.exports = IP2Location;
