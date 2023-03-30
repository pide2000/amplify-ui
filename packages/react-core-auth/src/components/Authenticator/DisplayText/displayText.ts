import { capitalize, isString } from '@aws-amplify/ui';
import { DefaultDisplayText } from './types';

export const DEFAULT_AUTHENTICATOR_DISPLAY_TEXT: DefaultDisplayText = {
  getChallengeText: (challengeName) => `${challengeName}`,
  getCopyButtonText: (hasCopied) => (hasCopied ? 'Copied!' : 'Copy Code'),
  getFederatedProviderButtonText: (provider): string =>
    `Sign In with ${provider}`,
  getResetPasswordLinkText: () => 'Reset Password',
  getHeadingText: (route) => (isString(route) ? capitalize(route) : undefined),
  getSignInLinkText: () => 'Back to Sign In',
  getSignUpLinkText: () => 'Create Account',
  getSubHeadingText: (route) => `${route} Sub Heading`,
  getSubmitButtonText: (route) =>
    isString(route) ? `${capitalize(route)} Submit Button` : undefined,
};
