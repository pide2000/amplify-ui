import { AuthenticatorMachineContext, UseAuthenticator } from '../types';

// const authStatus = 'unauthenticated';
const challengeName = 'CUSTOM_CHALLENGE';
const codeDeliveryDetails =
  {} as AuthenticatorMachineContext['codeDeliveryDetails'];
const errorMessage = 'error';
const federatedProviders =
  [] as AuthenticatorMachineContext['federatedProviders'];
const initializeMachine = jest.fn();
const isPending = false;
const resendCode = jest.fn();
const route = 'idle';
const setNavigableRoute = jest.fn();
const skipVerification = jest.fn();
const signOut = jest.fn();
const submitForm = jest.fn();
const toFederatedSignIn = jest.fn();
const toResetPassword = jest.fn();
const toSignIn = jest.fn();
const toSignUp = jest.fn();
const totpSecretCode = undefined;
const unverifiedContactMethods = {};
const updateBlur = jest.fn();
const updateForm = jest.fn();

export const mockMachineContext: AuthenticatorMachineContext = {
  challengeName,
  codeDeliveryDetails,
  errorMessage,
  federatedProviders,
  initializeMachine,
  isPending,
  loginMechanism: 'username',
  resendCode,
  route,
  signOut,
  submitForm,
  updateForm,
  toSignIn,
  toSignUp,
  updateBlur,
  setNavigableRoute,
  skipVerification,
  toFederatedSignIn,
  toResetPassword,
  totpSecretCode,
  unverifiedContactMethods,
  username: 'Charles',
};

export const mockUseAuthenticatorOutput: UseAuthenticator = {
  authStatus: 'configuring',
  ...mockMachineContext,
};
