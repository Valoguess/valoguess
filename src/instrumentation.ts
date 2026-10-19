import { type Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@/lib/logger");
    const util = (await import("util")).default;

    function formatArgs(args: any[]) {
      if (args.length === 0) return [""];
      if (args.length === 1 && typeof args[0] === "string") return [args[0]];

      const errIndex = args.findIndex((a) => a instanceof Error);
      if (errIndex !== -1) {
        const err = args[errIndex];
        const rest = args.filter((_, idx) => idx !== errIndex);
        return [{ err }, rest.length > 0 ? util.format(...rest) : err.message];
      }
      return [util.format(...args)];
    }

    // Intercept standard console calls and route through Pino
    console.log = (...args: any[]) => (logger.info as any)(...formatArgs(args));
    console.info = (...args: any[]) => (logger.info as any)(...formatArgs(args));
    console.warn = (...args: any[]) => (logger.warn as any)(...formatArgs(args));
    console.error = (...args: any[]) => (logger.error as any)(...formatArgs(args));
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@/lib/logger");
    logger.error(
      {
        err,
        path: request.path,
        method: request.method,
        routerKind: context.routerKind,
        routeType: context.routeType,
      },
      "Server request error",
    );
  }
};