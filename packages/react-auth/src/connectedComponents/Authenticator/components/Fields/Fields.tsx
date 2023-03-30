import React from 'react';

import { useComponents } from '@aws-amplify/ui-react-core-auth';

import { useFields } from './FieldsContext';

function Field(props: any) {
  const { Fields } = useComponents();
  return <Fields.Field {...props} />;
}

function Fields(): JSX.Element | null {
  const { fields } = useFields();

  if (!Array.isArray(fields)) {
    return null;
  }

  return <>{fields?.map(Field)}</>;
}

export default Object.assign(Fields, { Field, Fields });
