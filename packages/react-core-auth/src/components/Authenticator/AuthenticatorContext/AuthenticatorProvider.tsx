import React, { ReactNode, useEffect, useMemo } from 'react';
import { useInterpret } from '@xstate/react';

import { Auth } from 'aws-amplify';
import {
  AuthMachineHubHandler,
  AuthenticatorMachineOptions,
  AuthStatus,
  createAuthenticatorMachine,
  defaultAuthHubHandler,
  listenToAuthHub,
} from '@aws-amplify/ui';

import { AuthenticatorContext } from './AuthenticatorContext';

type Options = Parameters<AuthMachineHubHandler>[2];

const createHubHandler =
  (options: Options): AuthMachineHubHandler =>
  async (data, service) => {
    await defaultAuthHubHandler(data, service, options);
  };

export default function AuthenticatorProvider({
  children,
  ...data
}: AuthenticatorMachineOptions & {
  children?: ReactNode;
}): JSX.Element {
  // `authStatus` is exposed by `useAuthenticator` but should not be derived directly from the
  // state machine as the machine only updates on `Authenticator` initiated events, which
  // leads to scenarios where the state machine `authStatus` gets "stuck". For exmample,
  // if a user was to sign in using `Auth.signIn` directly rather than using `Authenticator`
  const [authStatus, setAuthStatus] = React.useState<AuthStatus>('configuring');

  // only run on first render
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => {
        setAuthStatus('authenticated');
      })
      .catch(() => {
        setAuthStatus('unauthenticated');
      });
  }, []);

  const service = useInterpret(() => createAuthenticatorMachine(data));

  const value = useMemo(() => ({ authStatus, service }), [authStatus, service]);

  useEffect(() => {
    const onSignIn = () => {
      setAuthStatus('authenticated');
    };
    const onSignOut = () => {
      setAuthStatus('unauthenticated');
    };

    const unsubscribe = listenToAuthHub(
      service,
      createHubHandler({ onSignIn, onSignOut })
    );
    return unsubscribe;
  }, [service]);

  return (
    <AuthenticatorContext.Provider value={value}>
      {children}
    </AuthenticatorContext.Provider>
  );
}
