import { LoginMechanism, UnverifiedContactMethods } from '@aws-amplify/ui';

import {
  CONFIRM_PASSWORD,
  CONFIRMATION_CODE,
  DIAL_CODE,
  PASSWORD,
  PRIMARY_ALIAS,
  USERNAME_EMAIL,
  USERNAME_PHONE,
  SIGN_UP_EMAIL,
  // SIGN_UP_PASSWORD,
  SIGN_UP_USERNAME,
} from './constants';
import { CommonFieldOptions } from './types';
import { AuthenticatorRouteComponentKey } from '../../AuthenticatorContext';

// const createDialCode = (route: AuthenticatorRoute, name: string) => ({
//   ...DIAL_CODE,
//   name: `${route}.${name}`,
// });

export default function getDefaultFields<
  Route extends AuthenticatorRouteComponentKey | undefined
>({
  route,
  loginMechanism,
}: // unverifiedContactMethods,
{
  route: Route;
  loginMechanism: LoginMechanism | undefined;
  unverifiedContactMethods: UnverifiedContactMethods | undefined;
}): CommonFieldOptions[] {
  if (!loginMechanism || undefined) {
    return [];
  }

  switch (route) {
    case 'confirmSignIn':
    case 'confirmVerifyUser':
    case 'confirmSignUp':
    case 'setupTOTP': {
      return [CONFIRMATION_CODE].map(({ name, ...rest }) => ({
        ...rest,
        name: `${route}.${name}`,
      }));
    }
    case 'signIn': {
      return [
        loginMechanism === 'phone_number'
          ? USERNAME_PHONE
          : PRIMARY_ALIAS[loginMechanism],
        PASSWORD,
      ];
    }
    case 'signUp': {
      return [
        // ...(loginMechanism === 'phone_number'
        //   ? [USERNAME_PHONE, DIAL_CODE]
        //   : [PRIMARY_ALIAS[loginMechanism]]),
        SIGN_UP_USERNAME,
        SIGN_UP_EMAIL,
        PASSWORD,
        // SIGN_UP_PASSWORD,
        CONFIRM_PASSWORD,
      ];
    }
    case 'resetPassword': {
      return [
        loginMechanism === 'phone_number'
          ? USERNAME_PHONE
          : PRIMARY_ALIAS[loginMechanism],
      ];
    }
    case 'verifyUser': {
      // ...do stuff with unverifiedContactMethods
      return [];
    }

    default:
      return [];
  }
}
