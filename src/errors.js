class HTTPError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}

class BadRequestError extends HTTPError {
  constructor(details) {
    super('Bad Request', 400, details);
  }
}

class NotFoundError extends HTTPError {
  constructor(details) {
    super('Not Found', 404, details);
  }
}

class TooManyRequestsError extends HTTPError {
  constructor() {
    super('Too Many Requests', 429);
  }
}

class InternalServerError extends HTTPError {
  constructor() {
    super('Internal Server Error', 500);
  }
}

class ServiceUnavailableError extends HTTPError {
  constructor() {
    super('Service Unavailable', 503);
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  TooManyRequestsError,
  InternalServerError,
  ServiceUnavailableError,
};
