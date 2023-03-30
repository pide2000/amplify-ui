import React from 'react';

import { UseFederatedProviders } from '@aws-amplify/ui-react-core-auth';
import {
  Button as ButtonBase,
  ButtonProps,
  Flex,
  FlexProps,
} from '@aws-amplify/ui-react';

import Icon from './Icon';

type Providers = Partial<Pick<UseFederatedProviders, 'providers'>>;

function Button({
  children,
  className = 'federated-sign-in-button',
  fontWeight = 'normal',
  gap = '1rem',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <ButtonBase
      {...props}
      className={className}
      fontWeight={fontWeight}
      gap={gap}
    >
      {children}
    </ButtonBase>
  );
}

function View({
  className = 'federated-sign-in-container',
  direction = 'column',
  padding = '0 0 1rem 0',
  ...props
}: FlexProps): JSX.Element {
  return (
    <Flex
      {...props}
      className={className}
      direction={direction}
      padding={padding}
    />
  );
}

// `FederatedProviders` needs to be a component in other for it to be available as a static
// property on the `Authenticator` for composability but is ultimately replaced by the context
// aware version of the component, so use a "dummy" component here
const FederatedProviders = (_: Providers) => null;
export default Object.assign(FederatedProviders, { Button, Icon, View });
