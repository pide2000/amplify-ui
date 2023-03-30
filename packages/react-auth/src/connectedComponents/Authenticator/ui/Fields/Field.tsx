import React from 'react';

import { isString, Prettify } from '@aws-amplify/ui';
import {
  CheckboxField,
  PasswordField,
  PhoneNumberField as PhoneNumberFieldBase,
  Radio,
  RadioGroupField as RadioGroupFieldBase,
  SelectField,
  TextField,
} from '@aws-amplify/ui-react';
import {
  FormFieldProvider,
  useFormField,
} from '@aws-amplify/ui-react-core-auth';

import {
  BaseFieldProps,
  CheckboxFieldOptions,
  FieldProps,
  PasswordFieldOptions,
  PhoneNumberFieldOptions,
  RadioGroupFieldOptions,
  SelectFieldOptions,
  TextFieldOptions,
} from './types';

const isSelectFieldOptions = (props: unknown): props is SelectFieldOptions =>
  (props as SelectFieldOptions).type === 'select';

const isTextFieldOptions = (props: unknown): props is TextFieldOptions =>
  (props as TextFieldOptions).type === 'text' ||
  (props as TextFieldOptions).type === 'email';

const isPasswordFieldOptions = (
  props: unknown
): props is PasswordFieldOptions =>
  (props as PasswordFieldOptions).type === 'password';

const isCheckboxFieldOptions = (
  props: unknown
): props is CheckboxFieldOptions =>
  (props as CheckboxFieldOptions).type === 'checkbox';

const isRadioGroupFieldOptions = (
  props: unknown
): props is RadioGroupFieldOptions =>
  (props as RadioGroupFieldOptions).type === 'radio';

const isPhoneNumberFieldOptions = (
  props: unknown
): props is PhoneNumberFieldOptions =>
  (props as PhoneNumberFieldOptions).type === 'tel';

type DialCodeSelectProps = Prettify<
  Parameters<typeof PhoneNumberFieldBase.DialCodeSelect>[0]
>;

const DialCodeSelect = (props: DialCodeSelectProps) => {
  const { name, onBlur, onChange, ref } = useFormField();

  // @todo combine handlers, merge ref?
  const combinedProps = { ...props, name, onBlur, onChange, ref };

  return <PhoneNumberFieldBase.DialCodeSelect {...combinedProps} />;
};

const ComposedDialCodeSelect = ({ name, ...props }: DialCodeSelectProps) => {
  if (!isString(name)) {
    return null;
  }

  return (
    <FormFieldProvider name={name}>
      <DialCodeSelect {...props} name={name} />
    </FormFieldProvider>
  );
};

const PhoneNumberField = React.forwardRef<
  HTMLInputElement,
  PhoneNumberFieldOptions
>(function PhoneNumberField({ dialCodeName, name, ...props }, ref) {
  return (
    <PhoneNumberFieldBase
      {...props}
      name={name}
      dialCodeName={dialCodeName ?? `prefix:${name}`}
      DialCodeSelect={ComposedDialCodeSelect}
      ref={ref}
    />
  );
});

const RadioGroupField = React.forwardRef<
  HTMLInputElement,
  RadioGroupFieldOptions
>(function RadioGroupField({ options, ...props }, ref) {
  return (
    <RadioGroupFieldBase {...props} ref={ref}>
      {options.map((option) => (
        // @todo do Radio options also need the ref?
        <Radio key={option} value={option}>
          {option}
        </Radio>
      ))}
    </RadioGroupFieldBase>
  );
});

// type FieldElementType<Type extends FormFieldProviderType> = Type extends
//   | 'tel'
//   | 'text'
//   ? HTMLInputElement
//   : Type extends 'select'
//   ? HTMLSelectElement
//   : HTMLDivElement;

// maybe needs to extend from React.MutableRefObject?
// type UnwrapRef<T extends React.Ref<any>> = T extends React.Ref<
//   infer ElementType
// >
//   ? ElementType
//   : never;
// type FieldPropsRef<Type extends FormFieldProviderType> = UnwrapRef<FieldProps<Type>['ref']>;

// const Field = React.forwardRef(function Field<Type extends FormFieldProviderType>(
const BaseField = (
  props: BaseFieldProps
  // @todo mergeRefs?
  // ref: React.ForwardedRef<any>
) => {
  const { error, name, onBlur, onChange, ref } = useFormField();
  const errorMessage = (error as { message?: string })?.message;

  const hasError = !!errorMessage;

  // @todo combine handlers, add util
  const combinedProps = {
    ...props,
    name,
    onBlur,
    onChange,
    ref,
    errorMessage,
    hasError,
  };

  return isSelectFieldOptions(combinedProps) ? (
    <SelectField {...combinedProps} />
  ) : isTextFieldOptions(combinedProps) ? (
    <TextField {...combinedProps} />
  ) : isPasswordFieldOptions(combinedProps) ? (
    <PasswordField {...combinedProps} />
  ) : isCheckboxFieldOptions(combinedProps) ? (
    <CheckboxField {...combinedProps} />
  ) : isPhoneNumberFieldOptions(combinedProps) ? (
    <PhoneNumberField {...combinedProps} />
  ) : isRadioGroupFieldOptions(combinedProps) ? (
    <RadioGroupField {...combinedProps} />
  ) : null;
};
// });

export default function Field({
  Field = BaseField,
  name,
  validate,
  ...rest
}: FieldProps): JSX.Element {
  return (
    <FormFieldProvider key={name} name={name} validate={validate}>
      <Field {...rest} name={name} />
    </FormFieldProvider>
  );
}
