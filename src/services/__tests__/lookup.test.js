const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');

const lookup = require('../lookup');
const { IP2LOCATION_RATE_PER_SECOND } = require('../../config');

describe('Lookup', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('Lookup an IP', () => {
    it('should return and cache a country name', async () => {
      const sample = { ip: '45.55.195.96', country_name: 'United States of America' };
      mock.onGet(/ip2location|ipstack/).replyOnce(200, sample);

      const times = [...Array(10 * IP2LOCATION_RATE_PER_SECOND)];
      const result = await Promise.all(times.map(() => lookup(sample.ip)));
      const expected = Array(times.length).fill({ country_name: sample.country_name });
      expect(result).toEqual(expect.arrayContaining(expected));
    });

    it('should fallback', async () => {
      const sample = { ip: '45.55.195.96', country_name: 'United States of America' };
      mock.onGet(/ip2location/).replyOnce(500, sample);
      mock.onGet(/ipstack/).replyOnce(200, sample);

      const result = await lookup(sample.ip);
      const expected = { country_name: sample.country_name };
      expect(result).toEqual(expected);
    });
  });
});
