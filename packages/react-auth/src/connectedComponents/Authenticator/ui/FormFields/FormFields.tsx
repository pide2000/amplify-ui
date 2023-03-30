import React from 'react';

import { Flex, FlexProps } from '@aws-amplify/ui-react';
import Field from './Field';

function View(props: FlexProps) {
  return <Flex {...props} />;
}

const FormFields = () => null;
export default Object.assign(FormFields, { Field, View });
