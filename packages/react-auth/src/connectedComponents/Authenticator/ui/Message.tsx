import React from 'react';

import { Alert, AlertProps } from '@aws-amplify/ui-react';

export default function Message({
  children,
  variation = 'error',
  ...props
}: AlertProps): JSX.Element {
  return (
    <Alert {...props} variation={variation}>
      {children}
    </Alert>
  );
}
