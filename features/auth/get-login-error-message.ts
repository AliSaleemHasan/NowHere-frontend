import { isApiError } from "@/lib/http/api-error";
import { getErrorMessage } from "@/utils";

const ACCOUNT_LOCKED_CODE = "ACCOUNT_LOCKED";
const ACCOUNT_LOCKED_STATUS = 423;

export function isAccountLockedError(error: unknown): boolean {
  return (
    isApiError(error) &&
    (error.code === ACCOUNT_LOCKED_CODE ||
      error.statusCode === ACCOUNT_LOCKED_STATUS)
  );
}

export function getLoginErrorMessage(
  error: unknown,
  lockoutMessage: string,
  fallbackMessage: string,
): string {
  if (isAccountLockedError(error)) return lockoutMessage;
  return getErrorMessage(error, fallbackMessage);
}
