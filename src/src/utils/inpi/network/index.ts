import Axios from "axios";
import axiosRetry from "axios-retry";
import * as https from "https";

import errorInterceptor from "./errors-interceptor";
import logInterceptor from "./log-interceptor";

// Keep soket alive
// https://stackoverflow.com/questions/44649566/difference-between-nodejs-new-agent-and-http-keep-alive-header/58332910#58332910
const axios = Axios.create({
  httpsAgent: new https.Agent({ keepAlive: true }),
});

axiosRetry(axios, {
  retryDelay: axiosRetry.exponentialDelay,
  retries: 5,
  retryCondition: (error) => {
    return error.response
      ? error.response.status === 429 || error.response.status >= 500
      : false;
  },
});
axios.interceptors.response.use(logInterceptor, errorInterceptor);

/**
 * Default axios client
 * @param config
 * @returns
 */
const httpClient = (config) => {
  return axios({
    timeout: 3000,
    ...config,
  });
};

const httpPost = (url, data, config) =>
  httpClient({ ...config, url, method: "POST", data });

/**
 * GET axios client
 * @param url
 * @param config
 * @returns
 */
const httpGet = (url, config) => httpClient({ ...config, url, method: "GET" });

const httpPut = (url, data, config) =>
  httpClient({ ...config, url, method: "PUT", data });

const httpPatch = (url, data, config) =>
  httpClient({ ...config, url, method: "PATCH", data });

const httpDelete = (url, config) =>
  httpClient({ ...config, url, method: "DELETE" });

export { httpClient, httpGet, httpPost, httpPut, httpPatch, httpDelete };

export default httpClient;
