import { AppError } from "./ApiError";

export function asyncHandler<T extends any[]>(
  handler: (...args: T) => Promise<void>,
) {
  return async (...args: T) => {
    try {
      await handler(...args);
    } catch (err) {
      if (err instanceof AppError) {

        return null;
      }

      console.error(err);
    }
  };
}