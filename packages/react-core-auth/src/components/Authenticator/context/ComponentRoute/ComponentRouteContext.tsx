import React from 'react';
import { createContextUtility } from '@aws-amplify/ui-react-core';

import {
  AuthenticatorRouteComponentKey,
  useAuthenticator,
  UseAuthenticator,
  isComponentRouteKey,
} from '../../AuthenticatorContext';

interface ComponentRouteContextType
  extends Pick<UseAuthenticator, 'setNavigableRoute'> {
  route: AuthenticatorRouteComponentKey | undefined;
}

const [ComponentRouteContext, useComponentRoute] = createContextUtility<
  ComponentRouteContextType | null,
  ComponentRouteContextType
>({
  initialValue: null,
});

function ComponentRouteProvider({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  const { route: _route, setNavigableRoute } = useAuthenticator(
    ({ route, setNavigableRoute }) => [route, setNavigableRoute]
  );

  const route = isComponentRouteKey(_route) ? _route : undefined;
  const value = React.useMemo(
    () => ({ route, setNavigableRoute }),
    [route, setNavigableRoute]
  );

  return (
    <ComponentRouteContext.Provider value={value}>
      {route ? children : null}
    </ComponentRouteContext.Provider>
  );
}

export { ComponentRouteProvider, useComponentRoute };
