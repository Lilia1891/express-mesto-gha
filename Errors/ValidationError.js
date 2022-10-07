const { BAD_REQUEST_ERROR } = require('../constants');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = BAD_REQUEST_ERROR;
    this.errorMessage = message;
    this.name = 'ValidationError';
  }
}
module.exports = ValidationError;
