import { useAuthenticator, UseAuthenticator } from '../../AuthenticatorContext';

export interface UseLoginMechanism
  extends Pick<UseAuthenticator, 'loginMechanism'> {}

export default function useLoginMechanism(): UseLoginMechanism {
  const { loginMechanism } = useAuthenticator(({ loginMechanism }) => [
    loginMechanism,
  ]);

  // return { loginMechanism: 'phone_number' };

  return { loginMechanism };
}
