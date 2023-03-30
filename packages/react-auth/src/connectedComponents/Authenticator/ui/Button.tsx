import React from 'react';

import { Button as ButtonBase, ButtonProps } from '@aws-amplify/ui-react';

export default function Button({
  variation = 'primary',
  type = 'submit',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <ButtonBase
      {...props}
      // @TODO: replace with classname
      fontWeight="normal"
      type={type}
      variation={variation}
    />
  );
}
