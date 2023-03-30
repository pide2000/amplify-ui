import React from 'react';

import { capitalize, FederatedProvider } from '@aws-amplify/ui';
import { useAuthenticator } from '../../AuthenticatorContext';

import { useDisplayText } from '../../DisplayText';

interface Provider {
  text: string | undefined;
  handleAction: () => void;
  provider: FederatedProvider;
}

export interface UseFederatedProviders {
  providers: Provider[] | undefined;
}

export default function useFederatedProviders(): UseFederatedProviders {
  const { federatedProviders, toFederatedSignIn: toFederatedProvider } =
    useAuthenticator(({ federatedProviders, toFederatedSignIn }) => [
      federatedProviders,
      toFederatedSignIn,
    ]);

  const { getFederatedProviderButtonText } = useDisplayText();

  const providers = React.useMemo(() => {
    return federatedProviders?.map((provider) => ({
      handleAction: () => {
        toFederatedProvider({ provider });
      },
      provider,
      text: getFederatedProviderButtonText(capitalize(provider)),
    }));
  }, [getFederatedProviderButtonText, federatedProviders, toFederatedProvider]);

  return { providers };
}
