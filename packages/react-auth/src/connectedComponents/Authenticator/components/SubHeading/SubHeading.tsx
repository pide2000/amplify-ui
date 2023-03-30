import React from 'react';

import { useComponents, useSubHeading } from '@aws-amplify/ui-react-core-auth';

export default function SubHeading({
  children,
  ...props
}: {
  children?: React.ReactNode;
}): JSX.Element | null {
  const { subHeadingText } = useSubHeading();

  const { SubHeading: Component } = useComponents();

  const subHeading = children ?? subHeadingText;

  if (!subHeading) {
    return null;
  }

  return <Component {...props}>{subHeading}</Component>;
}
