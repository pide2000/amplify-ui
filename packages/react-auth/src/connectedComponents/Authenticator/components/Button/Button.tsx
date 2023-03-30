import React from 'react';

import {
  useComponents,
  useSubmitButton,
} from '@aws-amplify/ui-react-core-auth';

export default function Button({
  children,
  isDisabled = false,
  ...props
}: {
  children?: React.ReactNode;
  isDisabled?: boolean;
}): JSX.Element {
  const { isDisabled: _isDisabled, submitButtonText } = useSubmitButton();
  const { Button: Component } = useComponents();

  return (
    <Component {...props} isDisabled={isDisabled || _isDisabled}>
      {children ?? submitButtonText}
    </Component>
  );
}
