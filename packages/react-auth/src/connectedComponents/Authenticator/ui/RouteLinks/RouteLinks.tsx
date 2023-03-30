import * as React from 'react';

import {
  Button as ButtonBase,
  ButtonProps,
  Flex,
  FlexProps,
} from '@aws-amplify/ui-react';

function Button({
  fontWeight = 'normal',
  type = 'button',
  variation = 'link',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <ButtonBase
      {...props}
      fontWeight={fontWeight}
      key={type}
      type={type}
      variation={variation}
    />
  );
}

const View = ({
  // @todo add classname here
  justifyContent = 'space-around',
  ...props
}: FlexProps): JSX.Element | null => {
  return <Flex {...props} justifyContent={justifyContent} />;
};

// `RouteLinks` needs to be a component in other for it to be available as a static
// property on the `Authenticator` for composability but is ultimately replaced by the context
// aware version of the component, so use a "dummy" component here
const RouteLinks = () => null;
export default Object.assign(RouteLinks, { Button, View });
