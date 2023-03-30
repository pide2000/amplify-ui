import React from 'react';

import { useComponents } from '@aws-amplify/ui-react-core-auth';

import useHeading from './useHeading';

export default function Heading({
  children,
  ...props
}: {
  children?: React.ReactNode;
}): JSX.Element | null {
  const { headingText } = useHeading();
  const { Heading } = useComponents();

  const heading = children ?? headingText;

  if (!heading) {
    return null;
  }

  return <Heading {...props}>{heading}</Heading>;
}
