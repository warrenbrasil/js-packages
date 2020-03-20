import { NodeTracerProvider } from "@opentelemetry/node";
// import Debug from '../src/helpers/Debug'
import { BatchSpanProcessor } from "@opentelemetry/tracing";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { getOpenTracingEnvironmentVariables } from "./getOpenTracingEnvironmentVariables";
import { Attributes, CanonicalCode } from "@opentelemetry/api";

// const debug = new Debug('OpenTrace')
export class OpenTrace {
  private provider: NodeTracerProvider;
  private static instance: OpenTrace;

  private constructor() {
    const env = getOpenTracingEnvironmentVariables();
    // this.provider = new NodeTracerProvider({logger: debug, plugins: {http: {enabled: env.enableHTTPPlugin, path:'@opentelemetry/plugin-http'}, https:{enabled:env.enableHTTPSPlugin, path:'@opentelemetry/plugin-https'}, ioredis: {enabled:env.enableRedisPlugin, path:'@opentelemetry/plugin-ioredis'}}});
    this.provider = new NodeTracerProvider({
      plugins: {
        http: {
          enabled: env.enableHTTPPlugin,
          path: "@opentelemetry/plugin-http"
        },
        https: {
          enabled: env.enableHTTPSPlugin,
          path: "@opentelemetry/plugin-https"
        },
        ioredis: {
          enabled: env.enableRedisPlugin,
          path: "@opentelemetry/plugin-ioredis"
        }
      }
    });
    const exporter = new JaegerExporter({
      serviceName: env.serviceName,
      host: env.host,
      port: env.port,
      tags: [
        {
          key: "language",
          value: "javascript"
        },
        {
          key: "commitSHA",
          value: env.commitSHA
        },
        { key: "environment", value: env.name }
      ]
    });
    this.provider.addSpanProcessor(new BatchSpanProcessor(exporter));
    if (env.enabled) {
      // debug.info(`Registering trace provider because environment.trace.enabled is: ${env.enabled}`)
      this.provider.register();
    } else {
      // debug.info(`Skipping open tracing provider registration environment.trace.enabled is: ${env.enabled}`)
    }
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new OpenTrace();
    }
    return OpenTrace.instance;
  }
  private getTracer(tracerName = "default") {
    return this.provider.getTracer(tracerName);
  }

  public createErrorSpan(
    spanName: string,
    attributes?: Attributes,
    code = CanonicalCode.UNKNOWN
  ) {
    const span = this.getTracer().startSpan(spanName);
    if (attributes) span.setAttributes(attributes);
    span.setStatus({
      code,
      message: "status setten to error by createErrorSpan function"
    });
    return span;
  }
  public startSpan(spanName: string, attributes?: Attributes) {
    const span = this.getTracer().startSpan(spanName);
    if (attributes) span.setAttributes(attributes);
    return span;
  }
}
