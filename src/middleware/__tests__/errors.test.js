const errors = require('../errors');

describe('Errors', () => {
  describe('Handle', () => {
    let mockRequest;
    let mockResponse = {};
    const nextFunction = jest.fn();

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn((status) => {
          this.status = status;
          return mockResponse;
        }),
        json: jest.fn(),
      };
    });

    test('default', () => {
      const err = {};

      const expectedResponse = {
        message: 'Internal Server Error',
        status_code: 500,
      };

      errors(err, mockRequest, mockResponse, nextFunction);
      expect(mockResponse.status).toBeCalledWith(500);
      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });
  });
});
