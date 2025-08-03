export const getErrorMessage = (err: unknown): string => {
  let message;
  if (err instanceof TypeError) {
    message = `Network Error: ${err.message}`;
  } else if (err instanceof Error) {
    message = `General Error: ${err.message}`;
  } else {
    message = `Unknown Error: ${err}`;
  }
  return message;
};
