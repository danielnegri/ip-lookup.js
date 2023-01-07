const errors = require('../errors');

describe('Errors', () => {
  describe('Handle', () => {
    let mockRequest;
    let mockResponse = {};
    const nextFunction = jest.fn();

    beforeAll(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

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
        error: 500,
        message: 'An internal error occurred.',
      };

      errors(err, mockRequest, mockResponse, nextFunction);
      expect(mockResponse.status).toBeCalledWith(500);
      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });
  });
});
