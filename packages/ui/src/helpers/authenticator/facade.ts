/**
 * This file contains helpers that translates xstate internals to more
 * understandable authenticator contexts. We provide these contexts with
 * `useAuthenticator` hook/composable/service.
 */

import { Sender } from 'xstate';

import {
  ActorContextWithForms,
  AmplifyUser,
  AuthEvent,
  AuthEventData,
  AuthEventTypes,
  AuthMachineState,
  ChallengeName,
  CodeDeliveryDetails,
  FederatedProvider,
  LoginMechanism,
  NavigableRoute,
  SocialProvider,
  UnverifiedContactMethods,
  ValidationError,
} from '../../types';

import { getActorContext, getActorState } from './actor';
import { NAVIGABLE_ROUTE_EVENTS } from './constants';

export type AuthenticatorRoute =
  | 'authenticated'
  | 'confirmResetPassword'
  | 'confirmSignIn'
  | 'confirmSignUp'
  | 'confirmVerifyUser'
  | 'forceNewPassword'
  | 'idle'
  | 'resetPassword'
  | 'setup'
  | 'signOut'
  | 'setupTOTP'
  | 'signIn'
  | 'signUp'
  | 'transition'
  | 'verifyUser';

type AuthenticatorValidationErrors = ValidationError;
export type AuthStatus = 'configuring' | 'authenticated' | 'unauthenticated';

interface AuthenticatorServiceContextFacade {
  codeDeliveryDetails: CodeDeliveryDetails;
  isPending: boolean;
  route: AuthenticatorRoute;
  totpSecretCode: string | null;
  unverifiedContactMethods: UnverifiedContactMethods;

  /**
   * @deprecated
   */
  authStatus: AuthStatus;
  /**
   * @deprecated
   */
  error: string | undefined;
  /**
   * @deprecated
   */
  hasValidationErrors: boolean;
  /**
   * @deprecated
   */
  socialProviders: SocialProvider[] | undefined;
  /**
   * @deprecated
   */
  user: AmplifyUser;
  /**
   * @deprecated
   */
  validationErrors: AuthenticatorValidationErrors;
}

interface NextAuthenticatorServiceContextFacade {
  challengeName: ChallengeName | undefined;
  codeDeliveryDetails: CodeDeliveryDetails | undefined;
  errorMessage: string | undefined;
  federatedProviders: FederatedProvider[] | undefined;
  loginMechanism: LoginMechanism | undefined;
  isPending: boolean;
  route: AuthenticatorRoute;
  totpSecretCode: string | undefined;
  username: string | undefined;
  unverifiedContactMethods: UnverifiedContactMethods | undefined;
}

type SendEventAlias =
  | 'initializeMachine'
  | 'resendCode'
  | 'signOut'
  | 'submitForm'
  | 'updateForm'
  | 'updateBlur'
  | 'toFederatedSignIn'
  | 'toResetPassword'
  | 'toSignIn'
  | 'toSignUp'
  | 'skipVerification';

type AuthenticatorSendEventAliases = Record<
  SendEventAlias,
  (data?: AuthEventData) => void
> & { setNavigableRoute: (route: NavigableRoute) => void };

export interface AuthenticatorServiceFacade
  extends AuthenticatorSendEventAliases,
    AuthenticatorServiceContextFacade {}

export interface NextAuthenticatorServiceFacade
  extends AuthenticatorSendEventAliases,
    NextAuthenticatorServiceContextFacade {}

/**
 * Creates public facing auth helpers that abstracts out xstate implementation
 * detail. Each framework implementation can export these helpers so that
 * developers can send events without having to learn internals.
 *
 * ```
 * const [state, send] = useActor(...);
 * const { submit } = getSendEventAliases(send);
 * submit({ username, password})
 * ```
 */

export const getSendEventAliases = (
  send: Sender<AuthEvent>
): AuthenticatorSendEventAliases => {
  const sendToMachine = (type: AuthEventTypes) => {
    // TODO If these were created during the creation of the machine & provider,
    // then invalid transitions could be caught via https://xstate.js.org/docs/guides/states.html#state-can-event
    return (data?: AuthEventData) => send({ type, data });
  };

  return {
    initializeMachine: sendToMachine('INIT'),
    resendCode: sendToMachine('RESEND'),
    signOut: sendToMachine('SIGN_OUT'),
    submitForm: sendToMachine('SUBMIT'),
    updateForm: sendToMachine('CHANGE'),
    updateBlur: sendToMachine('BLUR'),

    // Actions that don't immediately invoke a service but instead transition to a screen
    // are prefixed with `to*`
    toFederatedSignIn: sendToMachine('FEDERATED_SIGN_IN'),
    toResetPassword: sendToMachine('RESET_PASSWORD'),
    toSignIn: sendToMachine('SIGN_IN'),
    toSignUp: sendToMachine('SIGN_UP'),
    skipVerification: sendToMachine('SKIP'),

    // manual "route" navigation
    setNavigableRoute: (route: NavigableRoute) =>
      send({ type: NAVIGABLE_ROUTE_EVENTS[route] }),
  };
};

export const getServiceContextFacade = (
  state: AuthMachineState
): AuthenticatorServiceContextFacade => {
  const actorContext = (getActorContext(state) ?? {}) as ActorContextWithForms;
  const {
    codeDeliveryDetails,
    remoteError: error,
    unverifiedContactMethods,
    validationError: validationErrors,
    totpSecretCode = null,
  } = actorContext;

  const { socialProviders } = state.context?.config ?? {};

  // check for user in actorContext prior to state context. actorContext is more "up to date",
  // but is not available on all states
  const user = actorContext?.user ?? state.context?.user;

  const hasValidationErrors =
    validationErrors && Object.keys(validationErrors).length > 0;

  const actorState = getActorState(state);
  const isPending = state.hasTag('pending') || actorState?.hasTag('pending');

  // Any additional idle states added beyond (idle, setup) should be updated inside the authStatus below as well
  const route = (() => {
    switch (true) {
      case state.matches('idle'):
        return 'idle';
      case state.matches('setup'):
        return 'setup';
      case state.matches('signOut'):
        return 'signOut';
      case state.matches('authenticated'):
        return 'authenticated';
      case actorState?.matches('confirmSignUp'):
        return 'confirmSignUp';
      case actorState?.matches('confirmSignIn'):
        return 'confirmSignIn';
      case actorState?.matches('setupTOTP.edit'):
      case actorState?.matches('setupTOTP.submit'):
        return 'setupTOTP';
      case actorState?.matches('signIn'):
        return 'signIn';
      case actorState?.matches('signUp'):
        return 'signUp';
      case actorState?.matches('forceNewPassword'):
        return 'forceNewPassword';
      case actorState?.matches('resetPassword'):
        return 'resetPassword';
      case actorState?.matches('confirmResetPassword'):
        return 'confirmResetPassword';
      case actorState?.matches('verifyUser'):
        return 'verifyUser';
      case actorState?.matches('confirmVerifyUser'):
        return 'confirmVerifyUser';
      case actorState?.matches('setupTOTP.getTotpSecretCode'):
      case state.matches('signIn.runActor'):
        /**
         * This route is needed for autoSignIn to capture both the
         * autoSignIn.pending and the resolved states when the
         * signIn actor is running.
         */
        return 'transition';
      default:
        console.debug(
          'Cannot infer `route` from Authenticator state:',
          state.value
        );
        return null;
    }
  })();

  // Auth status represents the current state of the auth flow
  // The `configuring` state is used to indicate when the xState machine is loading
  const authStatus = ((route) => {
    switch (route) {
      case 'idle':
      case 'setup':
        return 'configuring';
      case 'authenticated':
        return 'authenticated';
      default:
        return 'unauthenticated';
    }
  })(route);

  return {
    authStatus,
    codeDeliveryDetails,
    error,
    hasValidationErrors,
    isPending,
    route,
    socialProviders,
    totpSecretCode,
    unverifiedContactMethods,
    user,
    validationErrors,
  };
};

export const getNextServiceContextFacade = (
  state: AuthMachineState
): NextAuthenticatorServiceContextFacade => {
  const actorContext = (getActorContext(state) ?? {}) as ActorContextWithForms;
  const {
    codeDeliveryDetails,
    remoteError: errorMessage,
    unverifiedContactMethods,
    totpSecretCode,
  } = actorContext;

  const { socialProviders: federatedProviders, loginMechanisms } =
    state.context?.config ?? {};

  const loginMechanism = loginMechanisms?.[0];

  // check for user in actorContext prior to state context. actorContext is more "up to date",
  // but is not available on all states
  const user = actorContext?.user ?? state.context?.user;
  const { challengeName, username } = user ?? {};

  const actorState = getActorState(state);
  const isPending = state.hasTag('pending') || actorState?.hasTag('pending');

  // Any additional idle states added beyond (idle, setup) should be updated inside the authStatus below as well
  const route = (() => {
    switch (true) {
      case state.matches('idle'):
        return 'idle';
      case state.matches('setup'):
        return 'setup';
      case state.matches('signOut'):
        return 'signOut';
      case state.matches('authenticated'):
        return 'authenticated';
      case actorState?.matches('confirmSignUp'):
        return 'confirmSignUp';
      case actorState?.matches('confirmSignIn'):
        return 'confirmSignIn';
      case actorState?.matches('setupTOTP.edit'):
      case actorState?.matches('setupTOTP.submit'):
        return 'setupTOTP';
      case actorState?.matches('signIn'):
        return 'signIn';
      case actorState?.matches('signUp'):
        return 'signUp';
      case actorState?.matches('forceNewPassword'):
        return 'forceNewPassword';
      case actorState?.matches('resetPassword'):
        return 'resetPassword';
      case actorState?.matches('confirmResetPassword'):
        return 'confirmResetPassword';
      case actorState?.matches('verifyUser'):
        return 'verifyUser';
      case actorState?.matches('confirmVerifyUser'):
        return 'confirmVerifyUser';
      case actorState?.matches('setupTOTP.getTotpSecretCode'):
      case state.matches('signIn.runActor'):
        /**
         * This route is needed for autoSignIn to capture both the
         * autoSignIn.pending and the resolved states when the
         * signIn actor is running.
         */
        return 'transition';
      default:
        console.debug(
          'Cannot infer `route` from Authenticator state:',
          state.value
        );
        return null;
    }
  })();

  return {
    challengeName,
    codeDeliveryDetails,
    errorMessage,
    federatedProviders,
    isPending,
    loginMechanism,
    route,
    totpSecretCode,
    unverifiedContactMethods,
    username,
  };
};

export const getServiceFacade = ({
  send,
  state,
}: {
  send: Sender<AuthEvent>;
  state: AuthMachineState;
}): AuthenticatorServiceFacade => {
  const sendEventAliases = getSendEventAliases(send);
  const serviceContext = getServiceContextFacade(state);

  return {
    ...sendEventAliases,
    ...serviceContext,
  };
};

export const getNextServiceFacade = ({
  send,
  state,
}: {
  send: Sender<AuthEvent>;
  state: AuthMachineState;
}): NextAuthenticatorServiceFacade => {
  const sendEventAliases = getSendEventAliases(send);
  const serviceContext = getNextServiceContextFacade(state);

  return {
    ...sendEventAliases,
    ...serviceContext,
  };
};
