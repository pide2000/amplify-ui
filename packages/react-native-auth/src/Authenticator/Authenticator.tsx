import React from 'react';

import { View, ViewProps } from 'react-native';
import {
  AuthenticatorProvider,
  DisplayTextProvider,
  FormHandle,
  withForm,
} from '@aws-amplify/ui-react-core-auth';
import { useSubmitButton } from '@aws-amplify/ui-react-core-auth';

import { Button } from '@aws-amplify/ui-react-native';
import { FieldsView } from './ui';

const Ugh = React.forwardRef<FormHandle, ViewProps>(
  // TODO: figure out the ref
  ({ children, ...props }, ref) => (
    <View
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ref={ref as any}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
      }}
    >
      {children}
    </View>
  )
);

Ugh.displayName = 'FormView';

const FormView = withForm(Ugh);

const SubmitButton = () => {
  const { onSubmit, isDisabled, submitButtonText } = useSubmitButton();
  // eslint-disable-next-line no-console
  console.log('Submit disabled', isDisabled);

  return (
    <Button disabled={isDisabled} onPress={onSubmit}>
      {submitButtonText}
    </Button>
  );
};

export default function Authenticator({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element | null {
  // eslint-disable-next-line no-console
  console.count('A Render');

  return (
    <AuthenticatorProvider>
      <DisplayTextProvider>
        {children ? (
          children
        ) : (
          <FormView>
            <FieldsView />
            <SubmitButton />
          </FormView>
        )}
      </DisplayTextProvider>
    </AuthenticatorProvider>
  );
}
