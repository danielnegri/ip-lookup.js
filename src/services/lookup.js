const CircuitBreaker = require('opossum');
const NodeCache = require('node-cache');

const { CACHE_TTL, IP2LOCATION_KEY, IP2LOCATION_RATE_PER_SECOND, IP2LOCATION_TIMEOUT } = require('../config');
const logger = require('../logger');
const IP2Location = require('./providers/ip2location');
const Lock = require('./lock');

const cache = new NodeCache({ stdTTL: CACHE_TTL });
const ip2Location = new IP2Location(IP2LOCATION_KEY, IP2LOCATION_RATE_PER_SECOND, IP2LOCATION_TIMEOUT);
const lock = new Lock();

const lookupFromAPI = async (ip) => {
  const abortController = new AbortController();

  const options = {
    abortController,
    timeout: IP2LOCATION_TIMEOUT,
  };
  const breaker = new CircuitBreaker(ip2Location.lookup, options);
  const result = await breaker.fire(ip, abortController.signal);
  logger.debug(`Lookup - Found IP ${ip}: ${JSON.stringify(result)}`);

  return result;
};

/**
 * Lookup IPv4 and IPv6 addresses.
 *
 * @param {String} ip The IP address
 *
 * @returns {String} The associated country name
 */
const lookup = async (ip) => {
  const key = `lookup::${ip}`;

  // Make sure that only one of many concurrent calls access the external APIs.
  await lock.acquire();
  const cached = cache.get(key);
  if (cached) {
    logger.debug(`Lookup - Cache Hit ${key}`);
    lock.release();
    return cached;
  }

  const result = await lookupFromAPI(ip)
    .then((value) => {
      logger.debug(`Cache - Setting ${key}`);
      cache.set(key, value, CACHE_TTL);
      return value;
    })
    .finally(() => {
      lock.release();
    });

  return result;
};

module.exports = lookup;
