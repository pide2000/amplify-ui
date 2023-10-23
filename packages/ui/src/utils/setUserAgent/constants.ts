import {
  AuthAction,
  AuthUserAgentInput,
  Category,
  GeoAction,
  GeoUserAgentInput,
  InAppMessagingUserAgentInput,
  InAppMessagingAction,
  SetCustomUserAgentInput,
  StorageAction,
  StorageUserAgentInput,
} from '@aws-amplify/core/internals/utils';

export const ACCOUNT_SETTINGS_INPUT_BASE: Omit<
  SetCustomUserAgentInput,
  'additionalDetails'
> = {
  apis: [AuthAction.DeleteUser, AuthAction.UpdatePassword],
  category: Category.Auth,
};

export const AUTHENTICATOR_INPUT_BASE: Omit<
  AuthUserAgentInput,
  'additionalDetails'
> = {
  apis: [
    AuthAction.SignUp,
    AuthAction.ConfirmSignUp,
    AuthAction.ResendSignUpCode,
    AuthAction.SignIn,
    AuthAction.ConfirmSignIn,
    AuthAction.FetchUserAttributes,
    AuthAction.SignOut,
    AuthAction.ResetPassword,
    AuthAction.ConfirmResetPassword,
    AuthAction.SignInWithRedirect,
  ],
  category: Category.Auth,
};

export const IN_APP_MESSAGING_INPUT_BASE: Omit<
  InAppMessagingUserAgentInput,
  'additionalDetails'
> = {
  apis: [InAppMessagingAction.NotifyMessageInteraction],
  category: Category.InAppMessaging,
};

export const LOCATION_SEARCH_INPUT_BASE: Omit<
  GeoUserAgentInput,
  'additionalDetails'
> = {
  category: Category.Geo,
  apis: [
    GeoAction.SearchByText,
    GeoAction.SearchForSuggestions,
    GeoAction.SearchByPlaceId,
  ],
};

export const MAP_VIEW_INPUT_BASE: Omit<GeoUserAgentInput, 'additionalDetails'> =
  {
    category: Category.Geo,
    apis: [],
  };

export const STORAGE_MANAGER_INPUT_BASE: Omit<
  StorageUserAgentInput,
  'additionalDetails'
> = {
  apis: [StorageAction.UploadData],
  category: Category.Storage,
};
