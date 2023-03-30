import React from 'react';

import { FederatedProvider, isString } from '@aws-amplify/ui';
import {
  useComponents,
  useFederatedProviders,
  UseFederatedProviders,
} from '@aws-amplify/ui-react-core-auth';

type Providers = Partial<Pick<UseFederatedProviders, 'providers'>>;

function Button({
  children,
  ...props
}: {
  children?: React.ReactNode;
  onClick?: () => void;
}): JSX.Element {
  const {
    FederatedProviders: { Button: Component },
  } = useComponents();
  return <Component {...props}>{children}</Component>;
}

function Icon(props: { provider?: FederatedProvider }): JSX.Element {
  const {
    FederatedProviders: { Icon: Component },
  } = useComponents();
  return <Component {...props} />;
}

function View(props: { children?: React.ReactNode }): JSX.Element {
  const {
    FederatedProviders: { View: Component },
  } = useComponents();
  return <Component {...props} />;
}

function Buttons({
  providers: overrideProviders,
}: Providers): JSX.Element | null {
  const { providers: defaultProviders } = useFederatedProviders();

  const providers = overrideProviders ?? defaultProviders;

  if (!Array.isArray(providers)) {
    return null;
  }

  return (
    <>
      {providers.map(({ text, handleAction, provider }) =>
        isString(text) ? (
          <Button onClick={handleAction} key={provider}>
            <Icon provider={provider} />
            {text}
          </Button>
        ) : null
      )}
    </>
  );
}

function FederatedProviders({
  providers: overrideProviders,
}: Providers): JSX.Element | null {
  const { providers: defaultProviders } = useFederatedProviders();

  const providers = overrideProviders ?? defaultProviders;
  if (!Array.isArray(providers)) {
    return null;
  }

  return (
    <View>
      <Buttons providers={providers} />
    </View>
  );
}

export default Object.assign(FederatedProviders, {
  Button,
  Buttons,
  Icon,
  View,
});
