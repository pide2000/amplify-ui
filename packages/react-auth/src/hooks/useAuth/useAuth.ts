import React from 'react';

import { Hub, HubCallback } from '@aws-amplify/core';
import { AmplifyUser } from '@aws-amplify/ui';
import { Auth } from 'aws-amplify';

export interface UseAuth {
  error: Error | undefined;
  getIsAuthenticated: () => Promise<boolean>;
  user: AmplifyUser | undefined;
}

export default function useAuth(): UseAuth {
  const [result, setResult] = React.useState<Pick<UseAuth, 'error' | 'user'>>({
    error: undefined,
    user: undefined,
  });

  const getIsAuthenticated = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Hub events like `tokenRefresh` will not give back the user object.
   * This util will be used to get current user after those events.
   */
  const fetchCurrentUser = React.useCallback(async () => {
    try {
      // casting the result because `Auth.currentAuthenticateduser` returns `any`
      const user = (await Auth.currentAuthenticatedUser()) as AmplifyUser;
      setResult((prev) => ({ ...prev, user }));
    } catch (e) {
      const error = e as Error;
      setResult((prev) => ({ ...prev, error }));
    }
  }, []);

  const handleAuth: HubCallback = React.useCallback(
    ({ payload }) => {
      switch (payload.event) {
        // success events
        case 'signIn':
        case 'signUp':
        case 'autoSignIn': {
          setResult((prev) => ({ ...prev, user: payload.data as AmplifyUser }));
          break;
        }
        case 'signOut': {
          setResult((prev) => ({ ...prev, user: undefined }));
          break;
        }

        // failure events
        case 'tokenRefresh_failure':
        case 'signIn_failure': {
          setResult((prev) => ({ ...prev, error: payload.data as Error }));
          break;
        }
        case 'autoSignIn_failure': {
          // autoSignIn just returns error message. Wrap it to an Error object
          const error = new Error(payload.message);
          setResult((prev) => ({ ...prev, error }));
          break;
        }

        // events that need another fetch
        case 'tokenRefresh': {
          fetchCurrentUser();
          break;
        }

        default: {
          // we do not handle other hub events like `configured`.
          break;
        }
      }
    },
    [fetchCurrentUser]
  );

  React.useEffect(() => {
    fetchCurrentUser(); // on init, see if user is already logged in

    const unsubscribe = Hub.listen('auth', handleAuth, 'useAuth');
    return unsubscribe;
  }, [handleAuth, fetchCurrentUser]);

  return { ...result, getIsAuthenticated };
}
