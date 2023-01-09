const axios = require('axios');
const { RateLimiter } = require('limiter');

const { IPSTACK_TIMEOUT } = require('../../config');
const { IPSTACK_URL } = require('../../constants');
const logger = require('../../logger');
const { InternalServerError, TooManyRequestsError } = require('../../errors');

class IPstack {
  /**
   * Create an instance of IPstack
   *
   * @param {String} apiKey The API key
   * @param {Object} rateLimit The amount of tokens per second limitation
   * @param {Number} timeout The number of milliseconds before client request times out. (default: IPSTACK_TIMEOUT)
   *
   * @returns {Axios} A new instance of IPstack
   */
  constructor(apiKey, rateLimit, timeout) {
    if (!apiKey) {
      throw Error('The "IPSTACK_KEY" environment variable is required');
    }

    this.apiKey = apiKey;
    this.limiter = new RateLimiter({
      tokensPerInterval: rateLimit,
      interval: 'second',
    });

    this.timeout = timeout || IPSTACK_TIMEOUT;
    this.lookup = this.lookup.bind(this);
    this.handleResult = this.handleResult.bind(this);
  }

  /**
   * Lookup IPv4 and IPv6 addresses.
   * For more information: https://ipstack.com/documentation
   *
   * @param {String} ip The IP address
   * @param {AbortSignal} abortSignal The signal that allows to abort a request
   *
   * @returns {String} The associated country name
   */
  async lookup(ip, abortSignal) {
    logger.info(`IPstack - Lookup ${ip}`);

    const tooManyRequestsError = new TooManyRequestsError('Exceeded quota');
    const limiter = this.limiter;

    if (!limiter.tryRemoveTokens(1)) {
      return Promise.reject(tooManyRequestsError);
    }

    const { country_name } = await axios({
      url: `${IPSTACK_URL}/${ip}?access_key=${this.apiKey}`,
      method: 'GET',
      'Content-Type': 'application/json',
      signal: abortSignal,
      timeout: this.timeout,
    })
      .then(this.handleResult)
      .catch((err) => {
        logger.error(`IPstack - Failed to lookup IP ${ip}`, err);
        return Promise.reject(new InternalServerError());
      });

    return { country_name };
  }

  handleResult(result) {
    const data = result.data;
    if (!data.error) {
      return data;
    }

    const error = data.error;
    const message = error ? error.info : JSON.stringify(error);
    logger.error(`IPstack - ${message}`);

    return Promise.reject(new InternalServerError());
  }
}

module.exports = IPstack;
