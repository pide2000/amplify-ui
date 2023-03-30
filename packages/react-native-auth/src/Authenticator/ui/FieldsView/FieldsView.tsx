import React from 'react';

import { View } from 'react-native';

import Field from './Field';
import { useFields, withFieldsProvider } from './FieldsContext';
import Fields from './Fields';
import { FieldsViewProps } from './types';

const FieldsView = ({
  children,
  ...props
}: FieldsViewProps): JSX.Element | null => {
  const { fields } = useFields();

  if (!fields?.length) {
    return null;
  }

  return <View {...props}>{children ?? <Fields />}</View>;
};

FieldsView.displayName = 'Authenticator.FieldsView';

export default withFieldsProvider(FieldsView, {
  Field,
  Fields,
});
