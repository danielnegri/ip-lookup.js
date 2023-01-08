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
      mock.onGet(/ip=(?:[0-9]{1,3}\.){3}[0-9]{1,3}/).replyOnce(200, sample);

      const times = [...Array(10 * IP2LOCATION_RATE_PER_SECOND)];
      const result = await Promise.all(times.map(() => lookup(sample.ip)));
      const expected = Array(times.length).fill({ country_name: sample.country_name });
      expect(result).toEqual(expect.arrayContaining(expected));
    });
  });
});
