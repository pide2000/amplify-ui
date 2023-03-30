import { useAuthenticator, UseAuthenticator } from '../../AuthenticatorContext';

export interface UseError {
  errorMessage: UseAuthenticator['errorMessage'];
  hasError: boolean;
}

export default function useError(): UseError {
  const { errorMessage } = useAuthenticator(({ errorMessage }) => [
    errorMessage,
  ]);

  const hasError = !!errorMessage;

  return { errorMessage, hasError };
}
