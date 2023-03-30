import React from 'react';

import Field from './Field';
import { useFields } from './FieldsContext';

const Fields = (): JSX.Element | null => {
  const { fields } = useFields();

  if (!Array.isArray(fields)) {
    return null;
  }

  return <>{fields?.map(Field)}</>;
};

Fields.displayName = 'Authenticator.FieldsView.Fields';

export default Fields;
