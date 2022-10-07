const { UNAUTHORIZED } = require('../constants');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.status = UNAUTHORIZED;
    this.errorMessage = message;
    this.name = 'AuthorizationError';
  }
}
module.exports = AuthorizationError;
