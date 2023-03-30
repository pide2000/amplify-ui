import React from 'react';

import { useComponents } from '@aws-amplify/ui-react-core-auth';

import { useFields } from './FieldsContext';

function View(props: { children?: React.ReactNode }): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    FormFields: { View: Component },
  } = useComponents() as any;
  return <Component {...props} />;
}

function Field(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    FormFields: { Field: Component },
  } = useComponents() as any;
  return <Component {...props} />;
}

function Fields(): JSX.Element | null {
  const { fields } = useFields();

  if (!Array.isArray(fields)) {
    return null;
  }

  return <>{fields?.map(Field)}</>;
}

function FormFields(): JSX.Element | null {
  const { fields } = useFields();

  if (!Array.isArray(fields)) {
    return null;
  }

  return (
    <View>
      <Fields />
    </View>
  );
}

export default Object.assign(FormFields, { Field, Fields, View });
