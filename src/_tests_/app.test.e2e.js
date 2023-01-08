const request = require('supertest');
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');
const app = require('../app');

describe('API End to End', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('Test index', () => {
    test('GET /', async () => {
      const sample = { ip: '45.55.195.96', country_name: 'Narnia' };
      mock.onGet(/ip=(?:[0-9]{1,3}\.){3}[0-9]{1,3}/).replyOnce(200, sample);

      const response = await request(app)
        .get(`/?ip=${sample.ip}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({ country_name: sample.country_name });
    });

    test('GET / should returns Bad Parameter', async () => {
      const response = await request(app)
        .get(`/`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

      const { message, status_code } = response.body;
      expect(message).toEqual('Bad Request');
      expect(status_code).toEqual(400);
    });
  });
});
