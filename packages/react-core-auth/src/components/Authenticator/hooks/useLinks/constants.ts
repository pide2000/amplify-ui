import { NavigableRoute } from '@aws-amplify/ui';
import { AuthenticatorRouteComponentKey } from '../..';

export const NAVIGABLE_ROUTES: Record<
  AuthenticatorRouteComponentKey,
  NavigableRoute[] | undefined
> = {
  confirmResetPassword: undefined,
  confirmSignIn: undefined,
  confirmSignUp: undefined,
  confirmVerifyUser: undefined,
  forceNewPassword: undefined,
  resetPassword: ['signIn'],
  setupTOTP: ['signIn'],
  signIn: ['resetPassword', 'signUp'],
  signUp: ['signIn'],
  verifyUser: undefined,
};
