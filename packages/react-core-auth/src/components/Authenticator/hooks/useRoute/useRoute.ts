import { useAuthenticator, UseAuthenticator } from '../../AuthenticatorContext';

export interface UseRoute
  extends Partial<Pick<UseAuthenticator, 'route' | 'setNavigableRoute'>> {}

export default function useRoute(): UseRoute {
  const { route, setNavigableRoute } = useAuthenticator(
    ({ route, setNavigableRoute }) => [route, setNavigableRoute]
  );

  return {
    route,
    setNavigableRoute,
  };
}
