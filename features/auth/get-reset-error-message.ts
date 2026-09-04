import { isApiError } from "@/lib/http/api-error";
import { getErrorMessage } from "@/utils";

export const PASSWORD_RESET_INVALID_CODE = "PASSWORD_RESET_INVALID";

export function isPasswordResetInvalidError(error: unknown): boolean {
  return isApiError(error) && error.code === PASSWORD_RESET_INVALID_CODE;
}

export function getResetErrorMessage(
  error: unknown,
  invalidMessage: string,
  fallbackMessage: string,
): string {
  if (isPasswordResetInvalidError(error)) return invalidMessage;
  return getErrorMessage(error, fallbackMessage);
}
