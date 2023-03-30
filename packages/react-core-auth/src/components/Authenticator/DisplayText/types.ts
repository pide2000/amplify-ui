import { ChallengeName, NavigationRoute, Prettify } from '@aws-amplify/ui';
import { AuthenticatorRouteComponentKey } from '../..';

// @todo do template types go in /ui-react-core or /ui?
type GetDisplayTextKey = `get${string}Text`;
type DisplayTextKey = `${string}Text`;

type DisplayTextTemplate = Record<GetDisplayTextKey | DisplayTextKey, any>;
type TypedDisplayText<T extends DisplayTextTemplate = DisplayTextTemplate> =
  Prettify<{
    [K in keyof T]: K extends GetDisplayTextKey
      ? (value: Parameters<T[K]>[0]) => string | undefined
      : K extends DisplayTextKey
      ? string
      : never;
  }>;

// Template types end here
type GetChallengeText = (
  challengeName: ChallengeName | undefined
) => string | undefined;

type GetCopyButtonText = (hasCopied: boolean) => string | undefined;

type GetFederatedProviderButtonText = (provider: string) => string | undefined;

type GetSubmitButtonText = (
  route: AuthenticatorRouteComponentKey | undefined
) => string | undefined;

type GetHeadingText = (
  route: AuthenticatorRouteComponentKey | undefined
) => string | undefined;

type GetSubHeadingText = (
  route: AuthenticatorRouteComponentKey | undefined
) => string | undefined;

type GetSignInLinkText = (route: NavigationRoute) => string | undefined;

type GetResetPasswordLinkText = (route: NavigationRoute) => string | undefined;

type GetSignUpLinkText = (route: NavigationRoute) => string | undefined;

/**
 * Authenticator display text
 */
export type DisplayText = TypedDisplayText<{
  getChallengeText?: GetChallengeText;
  getCopyButtonText?: GetCopyButtonText;
  getFederatedProviderButtonText?: GetFederatedProviderButtonText;
  getHeadingText?: GetHeadingText;
  getResetPasswordLinkText?: GetResetPasswordLinkText;
  getSignInLinkText?: GetSignInLinkText;
  getSignUpLinkText?: GetSignUpLinkText;
  getSubHeadingText?: GetSubHeadingText;
  getSubmitButtonText?: GetSubmitButtonText;
}>;

export type DefaultDisplayText = Required<DisplayText>;

export interface DisplayTextProviderProps {
  children?: React.ReactNode;
  displayText?: DisplayText;
}
