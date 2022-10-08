const { REGISTRATION_ERROR } = require('../constants');

class RegistrationError extends Error {
  constructor(message) {
    super(message);
    this.status = REGISTRATION_ERROR;
    this.errorMessage = message;
    this.name = 'RegistrationError';
  }
}
module.exports = RegistrationError;
