import {
  useAuthenticator,
  UseAuthenticator,
  UseAuthenticatorSelector,
} from '../../AuthenticatorContext';

export interface UseUnverifiedContactMethods
  extends Pick<UseAuthenticator, 'unverifiedContactMethods'> {}

const selector: UseAuthenticatorSelector = ({ unverifiedContactMethods }) => [
  unverifiedContactMethods,
];

export default function useUnverifiedContactMethods(): UseUnverifiedContactMethods {
  const { unverifiedContactMethods } = useAuthenticator(selector);

  return { unverifiedContactMethods };
}
