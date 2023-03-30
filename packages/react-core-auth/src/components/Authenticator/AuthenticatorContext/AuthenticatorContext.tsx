import React from 'react';

import { AuthStatus, AuthInterpreter } from '@aws-amplify/ui';

/**
 * Authenticator React.Context type
 */
interface AuthenticatorContextType {
  authStatus: AuthStatus;
  service: AuthInterpreter;
}

/**
 * AuthenticatorContext serves static reference to the auth machine service.
 *
 * https://xstate.js.org/docs/recipes/react.html#context-provider
 */
export const AuthenticatorContext =
  React.createContext<AuthenticatorContextType | null>(null);
