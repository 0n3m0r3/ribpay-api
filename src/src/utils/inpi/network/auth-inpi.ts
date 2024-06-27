import { HttpTooManyRequests, HttpUnauthorizedError } from './http-exceptions';
import httpClient, { httpGet } from './index';

import { config } from 'dotenv-flow';
config();

let _token = '';

const getToken = async () => {
  const username = process.env.INPI_USERNAME;
  const password = process.env.INPI_PASSWORD;

  const response = await httpClient({
    method: 'POST',
    url: 'https://registre-national-entreprises.inpi.fr/api/sso/login',
    data: {
      username,
      password,
    },
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.token;
};

const authApiRneClient = async (route, options) => {
  const callback = () =>
    httpGet(route, {
      ...options,
      headers: { ...options?.headers, Authorization: `Bearer ${_token}` },
    });

  try {
    if (!_token) {
      _token = await getToken();
    }
    return await callback();
  } catch (e) {
    if (
      e instanceof HttpUnauthorizedError ||
      e instanceof HttpTooManyRequests
    ) {
      _token = await getToken();
      return await callback();
    } else {
      throw e;
    }
  }
};

export { authApiRneClient };
