import React from 'react';

import { Heading as HeadingBaase, HeadingProps } from '@aws-amplify/ui-react';

const DEFAULT_LEVEL: HeadingProps['level'] = 4;

export default function SubHeading({
  children,
  level = DEFAULT_LEVEL,
  ...props
}: HeadingProps): JSX.Element {
  return (
    <HeadingBaase {...props} level={level}>
      {children}
    </HeadingBaase>
  );
}
