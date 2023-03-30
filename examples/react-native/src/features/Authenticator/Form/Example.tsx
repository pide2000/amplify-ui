import React from 'react';
import { RefCallBack, Controller } from 'react-hook-form';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import {
  FormProvider,
  Validate,
  useSubmitButton,
  useError,
} from '@aws-amplify/ui-react-core-auth';
import { Prettify } from '@aws-amplify/ui';

// import { AnyComponent } from '@aws-amplify/ui-react-core';
import { Authenticator } from '@aws-amplify/ui-react-native-auth';
import {
  TextField,
  TextFieldProps,
  PasswordField,
  PasswordFieldProps,
  Button,
} from '@aws-amplify/ui-react-native';

import { Amplify } from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

type BaseFieldProps = {
  onBlur?: TextInputProps['onBlur'];
  onChangeText?: TextInputProps['onChangeText'];
  error?: boolean;
  errorMessage?: string;
  ref?: RefCallBack;
  type: 'text' | 'password';
};

type ControllerProps = {
  name: string;
  validate?: Validate;
};

type FieldComponent<P = {}> = React.ComponentType<BaseFieldProps & P>;

export type TypeUtil<C, P> = Prettify<C & Omit<P, keyof C>>;
function withController(
  Field: FieldComponent
): (
  props: ControllerProps & React.ComponentProps<FieldComponent>
) => JSX.Element {
  return ({ name, validate, ...rest }) => (
    <Controller
      name={name}
      render={({
        field: { onBlur, onChange: onChangeText, ref },
        fieldState: { error },
      }) => (
        <Field
          {...rest}
          error={!!error?.message}
          errorMessage={error?.message}
          onBlur={onBlur}
          onChangeText={onChangeText}
          ref={ref}
        />
      )}
      rules={{ validate }}
    />
  );
}

type FieldProps =
  | (TextFieldProps & { type: 'text' })
  | (PasswordFieldProps & { type: 'password' });

const BaseField = ({ type, ...rest }: FieldProps) => {
  const RenderField = type === 'text' ? TextField : PasswordField;
  return <RenderField {...rest} />;
};

const Field = withController(BaseField);

const CustomField = ({
  type: _,
  ...props
}: TextFieldProps & { type: 'text' | 'password' }) => {
  return <TextInput {...props} />;
};
export const TestField = withController(CustomField);

const BadButton = () => {
  // const { formState, getValues } = useFormContext();
  // console.log('formState', getValues());

  // const { handleSubmit } = useFormHandleSubmit();
  const { isDisabled, onSubmit } = useSubmitButton();
  const error = useError();
  console.log('error', error);

  return (
    <Button disabled={isDisabled} onPress={onSubmit}>
      'LOL'
    </Button>
  );
};

function App() {
  return (
    <Authenticator>
      <FormProvider>
        <View style={style.container}>
          <Field
            name="username"
            type="text"
            validate={(hi) => {
              return !hi?.length ? 'hi' : undefined;
            }}
          />
          <Field
            name="password"
            type="password"
            validate={(hi) => {
              return !hi?.length ? 'hi' : undefined;
            }}
          />
          {/* <TestField name="test" type="text" /> */}
          <BadButton />
          {/* <Button
        onPress={() =>
          handleSubmit((v) => {
            console.log('v', v);
          })
        }
        title={'LOL'}
      /> */}
        </View>
      </FormProvider>
    </Authenticator>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  field: { backgroundColor: 'pink', fontSize: 16, width: 48 },
});

export default App;
