import React, { useCallback } from 'react';
import { useSelector } from '@xstate/react';
import { AuthMachineState, getNextServiceFacade } from '@aws-amplify/ui';

import { AuthenticatorContext } from './AuthenticatorContext';

import { USE_AUTHENTICATOR_ERROR } from './constants';
import { UseAuthenticatorSelector, UseAuthenticator } from './types';
import { defaultComparator, getComparator } from './utils';

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator/headless#useauthenticator-hook)
 */
export default function useAuthenticator(
  selector?: UseAuthenticatorSelector
): UseAuthenticator {
  const context = React.useContext(AuthenticatorContext);

  if (!context) {
    throw new Error(USE_AUTHENTICATOR_ERROR);
  }

  const { authStatus, service } = context;
  const { send } = service;

  const xstateSelector = useCallback(
    (state: AuthMachineState) => getNextServiceFacade({ send, state }),
    [send]
  );

  const comparator = selector ? getComparator(selector) : defaultComparator;

  const facade = useSelector(service, xstateSelector, comparator);

  return { ...facade, authStatus };
}
