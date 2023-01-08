const querystring = require('querystring');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const { IP2LOCATION_URL } = require('../../../constants');
const IP2Location = require('../ip2location');

describe('IP2Location', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  test('Constructor', () => {
    expect(() => new IP2Location()).toThrow('The "IP2LOCATION_KEY" environment variable is required');
  });

  describe('Lookup an IP', () => {
    it('should return a country name', async () => {
      const sample = {
        ip: '1.1.1.1',
        country_code: 'US',
        country_name: 'United States of America',
        region_name: 'California',
        city_name: 'Los Angeles',
        latitude: 34.052859,
        longitude: -118.24357,
        zip_code: '90001',
        time_zone: '-08:00',
        asn: '13335',
        as: 'CloudFlare Inc.',
        is_proxy: false,
      };

      const params = {
        ip: sample.ip,
        key: 'secret',
      };

      const url = `${IP2LOCATION_URL}/?${querystring.stringify(params)}`;
      mock.onGet(url).reply(200, sample);

      const provider = new IP2Location(params.key, 1);
      const result = await provider.lookup(params.ip);

      expect(mock.history.get[0].url).toEqual(url);
      expect(result).toEqual({ country_name: 'United States of America' });
    });
  });

  describe('API call fails', () => {
    it('should return error', async () => {
      const query = querystring.stringify({
        ip: '8.8.8.8',
        key: 'secret',
      });

      const url = `${IP2LOCATION_URL}/?${query}`;

      mock.onGet(url).networkErrorOnce();

      const provider = new IP2Location('secret', 1);
      expect(provider.lookup('8.8.8.8')).rejects.toThrow();
      expect(mock.history.get[0].url).toEqual(url);
    });
  });

  describe('Exceeded quota', () => {
    it('should return error', async () => {
      const provider = new IP2Location('secret', 0);
      expect(provider.lookup('8.8.8.8')).rejects.toThrow('Exceeded quota');
    });
  });
});
