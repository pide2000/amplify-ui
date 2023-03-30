export * from './Authenticator';

// re-export shared `Authenticator` exports
export {
  useAuthenticator,
  UseAuthenticator,
  useFederatedProviders,
} from '@aws-amplify/ui-react-core-auth';
