import { useAuthenticator, UseAuthenticator } from '../../AuthenticatorContext';

interface UseChallengeName extends Pick<UseAuthenticator, 'challengeName'> {}

// can this be derived from `useAuth` in a way that makes sense?
// Current concern is that it would need to also look at `route` to prevent
// rendering the challange text when unecessary? But is that even really an
// issue since we would just be using in `useSubHeading` and that would
// already looks at the `route`?
export default function useChallengeName(): UseChallengeName {
  const { challengeName } = useAuthenticator(({ challengeName }) => [
    challengeName,
  ]);

  return { challengeName };
}
