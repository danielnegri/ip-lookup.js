const request = require('supertest');

const app = require('../app');

describe('API End to End', () => {
  describe('Test index', () => {
    test('GET /', async () => {
      const response = await request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        description: 'Forter Challenge',
        name: 'forter-challenge.js',
        version: '0.0.1',
      });
    });
  });
});
