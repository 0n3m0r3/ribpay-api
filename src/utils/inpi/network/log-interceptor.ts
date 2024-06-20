/**
 * Log into STDOUT in production
 * @param response
 */
const logInterceptor = (response) => {
  //@ts-ignore
  const log = `status=${response?.status} request=${response?.config?.url}`;
  console.log(log);
  return response;
};

export default logInterceptor;
