export class PageError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
