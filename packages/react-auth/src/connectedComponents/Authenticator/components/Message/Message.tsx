import React from 'react';

import { useComponents, useError } from '@aws-amplify/ui-react-core-auth';

export default function Message(): JSX.Element | null {
  const { errorMessage } = useError();
  const { Message: Component } = useComponents();

  if (!errorMessage) {
    return null;
  }
  return <Component>{errorMessage}</Component>;
}
