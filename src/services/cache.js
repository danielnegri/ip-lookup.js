const NodeCache = require('node-cache');

const { CACHE_TTL } = require('../config');
const logger = require('../logger');

const cache = new NodeCache({ stdTTL: CACHE_TTL });

module.exports.getCachedValueOrGenerateSerially = async (key, generatorFn, ttl) => {
  const cachePromise = cache.get(key);
  if (cachePromise) {
    return cachePromise;
  }

  const result = Promise.resolve(generatorFn());
  result
    .then((value) => {
      logger.debug(`Fetched value from key ${key}:${value}`);
    })
    .catch((err) => {
      logger.error(`Unable to fetch value for key ${key}`, err);
      cache.del(key);
    });

  cache.set(key, result, ttl);

  return result;
};
