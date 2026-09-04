import { ApiError } from "./http/api-error";

function isAuthFailure(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.statusCode === 401 || error.statusCode === 403)
  );
}

/** Default query retry: a couple of attempts, never for auth failures or missing resources. */
export function retryUnlessClientError(
  failureCount: number,
  error: unknown,
): boolean {
  if (isAuthFailure(error)) return false;
  if (error instanceof ApiError && error.statusCode === 404) return false;
  return failureCount < 2;
}

/** Profile/settings can 404 briefly after signup while JetStream creates the user. */
export function retryAfterSignupProfile(
  failureCount: number,
  error: unknown,
): boolean {
  if (error instanceof ApiError && error.statusCode === 404) {
    return failureCount < 6;
  }
  if (isAuthFailure(error)) return false;
  return failureCount < 2;
}

export function retryDelayBackoff(attemptIndex: number): number {
  return Math.min(400 * 2 ** attemptIndex, 4000);
}
