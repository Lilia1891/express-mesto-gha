const { FORBIDDEN_ERROR } = require('../constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = FORBIDDEN_ERROR;
    this.errorMessage = message;
    this.name = 'ForbiddenError';
  }
}
module.exports = ForbiddenError;
