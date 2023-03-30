import {
  AuthStatus,
  LegacyFormFieldOptions,
  NextAuthenticatorServiceFacade,
} from '@aws-amplify/ui';

export type AuthenticatorLegacyField = LegacyFormFieldOptions;
export type AuthenticatorLegacyFields = LegacyFormFieldOptions[];

/**
 * Inspired from https://xstate.js.org/docs/packages/xstate-react/#useselector-actor-selector-compare-getsnapshot.
 *
 * Selector accepts current facade values and returns an array of
 * desired value(s) that should trigger re-render.
 */
export type UseAuthenticatorSelector = (
  context: Partial<AuthenticatorMachineContext>
) => AuthenticatorMachineContext[AuthenticatorMachineContextKey][];

export interface UseAuthenticator extends NextAuthenticatorServiceFacade {
  authStatus: AuthStatus;
}

export type Comparator = (
  currentMachineContext: Partial<AuthenticatorMachineContext>,
  nextMachineContext: Partial<AuthenticatorMachineContext>
) => boolean;

export type AuthenticatorRouteComponentKey =
  | 'confirmResetPassword'
  | 'confirmSignIn'
  | 'confirmSignUp'
  | 'confirmVerifyUser'
  | 'forceNewPassword'
  | 'resetPassword'
  | 'setupTOTP'
  | 'signIn'
  | 'signUp'
  | 'verifyUser';

export type AuthenticatorRouteComponentName =
  Capitalize<AuthenticatorRouteComponentKey>;

/**
 * state machine context interface
 */
export type AuthenticatorMachineContext = NextAuthenticatorServiceFacade;
export type AuthenticatorMachineContextKey = keyof AuthenticatorMachineContext;
