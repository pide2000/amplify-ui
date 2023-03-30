import React from 'react';

import { NavigableRoute, NavigationRoute } from '@aws-amplify/ui';
import { useFormReset } from '../../../../Form';

import {
  AuthenticatorRouteComponentKey,
  isComponentRouteKey,
} from '../../AuthenticatorContext';

import { useDisplayText } from '../../DisplayText';
import { useRoute } from '../useRoute';

import { NAVIGABLE_ROUTES } from './constants';

interface Link {
  text: string | undefined;
  handleAction: () => void;
  type: NavigableRoute;
}

export interface UseLinks {
  links: Link[] | undefined;
}

const isNavigationRoute = (
  route: string | undefined
): route is NavigationRoute =>
  !!route && ['resetPassword', 'setupTOTP', 'signIn', 'signUp'].includes(route);

export default function useLinks(): UseLinks {
  const { getResetPasswordLinkText, getSignInLinkText, getSignUpLinkText } =
    useDisplayText();
  const { reset } = useFormReset();
  const { route, setNavigableRoute } = useRoute();
  // const { defaultValues } = useDefaultValues();

  const getLinkText = React.useCallback(
    (
      type: NavigableRoute,
      route: AuthenticatorRouteComponentKey | undefined
    ) => {
      if (!isNavigationRoute(route)) {
        return;
      }
      switch (type) {
        case 'resetPassword': {
          return getResetPasswordLinkText(route);
        }
        case 'signIn': {
          return getSignInLinkText(route);
        }
        case 'signUp': {
          return getSignUpLinkText(route);
        }
      }
    },
    [getResetPasswordLinkText, getSignInLinkText, getSignUpLinkText]
  );

  const links = React.useMemo(() => {
    if (!isComponentRouteKey(route)) {
      return undefined;
    }

    return NAVIGABLE_ROUTES[route]?.map((type) => ({
      text: getLinkText(type, route),
      handleAction: () => {
        // console.log('defaultValues', defaultValues);

        // reset(defaultValues);
        // @TODO: move to ui layer
        reset();
        setNavigableRoute?.(type);
      },
      type,
    }));
    // }, [defaultValues, getLinkText, reset, setNavigableRoute, route]);
  }, [getLinkText, reset, setNavigableRoute, route]);

  return { links };
}
