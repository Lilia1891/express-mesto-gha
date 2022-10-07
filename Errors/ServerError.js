const { INTERNAL_SERVER_ERROR } = require('../constants');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.status = INTERNAL_SERVER_ERROR;
    this.errorMessage = message;
    this.name = 'ServerError';
  }
}
module.exports = ServerError;
