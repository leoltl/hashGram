/* eslint-disable max-classes-per-file */
export class DOAError extends Error {
  constructor({ type, message }) {
    super(message);
    this.type = type;
    this.message = message;
  }
}

export class HTTPError extends Error {
  constructor({ status, message }) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class ClientError extends HTTPError {
  constructor({ status = 400, message }) {
    super({ status, message });
  }
}

export class AuthenticationError extends HTTPError {
  constructor({ status = 401, message }) {
    super({ status, message });
  }
}

export class AuthorizationError extends HTTPError {
  constructor({ status = 403, message }) {
    super({ status, message });
  }
}

export class ServerError extends HTTPError {
  constructor({ status, message = 'Interval Server Error' }) {
    super({ status, message });
  }
}
