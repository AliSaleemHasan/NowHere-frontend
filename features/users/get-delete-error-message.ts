import { isApiError } from "@/lib/http/api-error";
import { getErrorMessage } from "@/utils";

const ACCOUNT_DELETE_INCOMPLETE_CODE = "ACCOUNT_DELETE_INCOMPLETE";

export function isAccountDeleteIncompleteError(error: unknown): boolean {
  return isApiError(error) && error.code === ACCOUNT_DELETE_INCOMPLETE_CODE;
}

export function getDeleteAccountErrorMessage(
  error: unknown,
  incompleteMessage: string,
  fallbackMessage: string,
): string {
  if (isAccountDeleteIncompleteError(error)) return incompleteMessage;
  return getErrorMessage(error, fallbackMessage);
}
