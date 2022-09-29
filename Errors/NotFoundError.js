const { NOT_FOUND_ERROR } = require('../constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = NOT_FOUND_ERROR;
    this.errorMessage = message;
    this.name = 'NotFoundError';
  }
}
module.exports = NotFoundError;
