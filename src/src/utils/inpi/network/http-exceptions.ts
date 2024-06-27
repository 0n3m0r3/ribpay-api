export const isHttpError = (toBeDetermined) => {
  if (toBeDetermined.status && toBeDetermined.message) {
    return true;
  }
  return false;
};

interface ResponseError extends Error {
  status?: number;
}

export class HttpError extends Error {
  public status: number;
  public message: string;
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class HttpNotFound extends HttpError {
  constructor(message) {
    super(message, 404);
  }
}

export class HttpConnectionReset extends HttpError {
  constructor(message) {
    super(message, 500);
  }
}

export class HttpServerError extends HttpError {
  constructor(message) {
    super(message, 500);
  }
}
export class HttpTimeoutError extends HttpError {
  constructor(message) {
    super(message, 408);
  }
}

export class HttpTooManyRequests extends HttpError {
  constructor(message) {
    super(message, 429);
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(message) {
    super(message, 401);
  }
}

export class HttpForbiddenError extends HttpError {
  constructor(message) {
    super(message, 403);
  }
}
export class HttpBadRequestError extends HttpError {
  constructor(message) {
    super(message, 400);
  }
}
