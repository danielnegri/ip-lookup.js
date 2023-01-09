const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const { IPSTACK_URL } = require('../../../constants');
const IPstack = require('../ipstack');
const { TooManyRequestsError } = require('../../../errors');

const ACCESS_KEY = 'secret';

describe('IPstack', () => {
  let mock;
  let abortController;

  beforeAll(() => {
    mock = new MockAdapter(axios);
    abortController = new AbortController();
  });

  afterEach(() => {
    mock.reset();
  });

  test('Constructor', () => {
    expect(() => new IPstack()).toThrow('The "IPSTACK_KEY" environment variable is required');
  });

  describe('Lookup an IP', () => {
    it('should return a country name', async () => {
      const sample = {
        ip: '134.201.250.155',
        type: 'ipv4',
        continent_code: 'NA',
        continent_name: 'North America',
        country_code: 'US',
        country_name: 'United States',
        region_code: 'CA',
        region_name: 'California',
        city: 'Los Angeles',
        zip: '90013',
        latitude: 34.0453,
        longitude: -118.2413,
      };

      const url = `${IPSTACK_URL}/${sample.ip}?access_key=${ACCESS_KEY}`;
      mock.onGet(url).reply(200, sample);

      const provider = new IPstack(ACCESS_KEY, 1);
      const result = await provider.lookup(sample.ip, abortController.signal);

      expect(mock.history.get[0].url).toEqual(url);
      expect(result).toEqual({ country_name: 'United States' });
    });

    it('should return error when usage limit reached', async () => {
      const sample = {
        success: false,
        error: {
          code: 104,
          type: 'monthly_limit_reached',
          info: 'Your monthly API request volume has been reached. Please upgrade your plan.',
        },
      };

      const ip = '0.0.0.0';
      const url = `${IPSTACK_URL}/${ip}?access_key=${ACCESS_KEY}`;
      mock.onGet(url).reply(500, sample);

      const provider = new IPstack(ACCESS_KEY, 1);
      expect(provider.lookup(ip, abortController.signal)).rejects.toThrow();
      expect(mock.history.get[0].url).toEqual(url);
    });
  });

  describe('API call fails', () => {
    it('should return error', async () => {
      const ip = '8.8.8.8';
      const url = `${IPSTACK_URL}/${ip}?access_key=${ACCESS_KEY}`;

      mock.onGet(url).networkErrorOnce();

      const provider = new IPstack(ACCESS_KEY, 1);
      expect(provider.lookup(ip, abortController.signal)).rejects.toThrow();
      expect(mock.history.get[0].url).toEqual(url);
    });
  });

  describe('Exceeded quota', () => {
    it('should return error', async () => {
      const ip = '102.128.166.200';
      const provider = new IPstack(ACCESS_KEY, 0);
      const expected = new TooManyRequestsError('Exceeded quota');
      expect(provider.lookup(ip)).rejects.toThrow(expected);
    });
  });
});
