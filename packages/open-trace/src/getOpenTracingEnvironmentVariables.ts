export function getOpenTracingEnvironmentVariables() {
  return {
    enabled: String(process.env.ENABLE_OPEN_TRACE) === "true",
    host: String(process.env.OPEN_TRACE_SERVER_HOST),
    port: Number(process.env.OPEN_TRACE_SERVER_PORT),
    serviceName: String(process.env.OPEN_TRACE_SERVICE_NAME),
    enableRedisPlugin: String(process.env.ENABLE_OPEN_TRACE_REDIS) === "true",
    enableHTTPSPlugin: String(process.env.ENABLE_OPEN_TRACE_HTTPS) === "true",
    enableHTTPPlugin: String(process.env.ENABLE_OPEN_TRACE_HTTP) === "true",
    commitSHA: String(process.env.COMMIT_SHA),
    name: String(process.env.NODE_ENV)
  };
}
