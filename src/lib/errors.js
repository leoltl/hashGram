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

export class ServerError extends HTTPError {
  constructor({ status, message = 'Interval Server Error' }) {
    super({ status, message });
  }
}
