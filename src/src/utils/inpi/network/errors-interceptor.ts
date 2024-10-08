import {
  HttpConnectionReset,
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTimeoutError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
} from './http-exceptions';

const getStatus = (response, message) => {
  if (response?.status) {
    return response.status;
  }
  if ((message || '').indexOf('timeout of') > -1) {
    return 408;
  }
  return 500;
};

const errorInterceptor = (error) => {
  const { config, response, message } = error || {};

  const url = (config?.url || 'an unknown url').substring(0, 100);
  const status = getStatus(response, message);
  const statusText = response?.statusText;

  if (status !== 404) {
    const log = `status=${status} request=${url || ''}`;
    console.error(log);
  }

  switch (status) {
    case 429: {
      throw new HttpTooManyRequests(statusText || 'Too many requests');
    }
    case 404: {
      throw new HttpNotFound(statusText || 'Not Found');
    }
    case 403: {
      throw new HttpForbiddenError('Forbidden');
    }
    case 401: {
      throw new HttpUnauthorizedError('Unauthorized');
    }
    case 504: {
      throw new HttpTimeoutError('Timeout');
    }
    default:
      if ((message || '').indexOf('ECONNRESET') > -1) {
        throw new HttpConnectionReset(
          `ECONNRESET  while querying ${url}. ${statusText || ''} ${
            message || ''
          }`,
        );
      }
      throw new HttpServerError(
        `Unknown server error while querying ${url}. ${statusText || ''} ${
          message || ''
        }`,
      );
  }
};

export default errorInterceptor;
