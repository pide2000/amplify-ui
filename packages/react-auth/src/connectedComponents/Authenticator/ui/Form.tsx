import React from 'react';

import { Flex, FlexProps } from '@aws-amplify/ui-react';

type FormProps = FlexProps<'form'>;

export default function Form(props: FormProps): JSX.Element {
  return <Flex {...props} as="form" direction="column" />;
}
