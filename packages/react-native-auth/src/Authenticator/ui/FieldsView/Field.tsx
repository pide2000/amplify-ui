import React from 'react';
// import { Controller, useFormContext, useController } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';

// import { isString, Prettify } from '@aws-amplify/ui';
import {
  // Checkbox as CheckboxField,
  PasswordField,
  // PhoneNumberField,
  // Radio,
  // RadioGroup as RadioGroupField,
  TextField,
} from '@aws-amplify/ui-react-native';
// import {
//   FormFieldProvider,
//   useFormField,
// } from '@aws-amplify/ui-react-core-auth';

import {
  BaseFieldProps,
  // BaseFieldComponent,
  // CheckboxFieldOptions,
  FieldProps,
  PasswordFieldOptions,
  // PhoneNumberFieldOptions,
  // RadioGroupFieldOptions,
  TextFieldOptions,
} from './types';
import { TextInput } from 'react-native';

const isTextFieldOptions = (props: unknown): props is TextFieldOptions =>
  (props as TextFieldOptions).type === 'text' ||
  (props as TextFieldOptions).type === 'email';

const isPasswordFieldOptions = (
  props: unknown
): props is PasswordFieldOptions =>
  (props as PasswordFieldOptions).type === 'password';

// const isCheckboxFieldOptions = (
//   props: unknown
// ): props is CheckboxFieldOptions =>
//   (props as CheckboxFieldOptions).type === 'checkbox';

// const isRadioGroupFieldOptions = (
//   props: unknown
// ): props is RadioGroupFieldOptions =>
//   (props as RadioGroupFieldOptions).type === 'radio';

// const isPhoneNumberFieldOptions = (
//   props: unknown
// ): props is PhoneNumberFieldOptions =>
//   (props as PhoneNumberFieldOptions).type === 'tel';

// type DialCodeSelectProps = Prettify<
//   Parameters<typeof PhoneNumberField.DialCodeSelect>[0]
// >;

// const DialCodeSelect = (props: DialCodeSelectProps) => {
//   const { name, onBlur, onChange, ref } = useFormField();

//   // @todo combine handlers, merge ref?
//   const combinedProps = { ...props, name, onBlur, onChange, ref };

//   return <PhoneNumberField.DialCodeSelect {...combinedProps} />;
// };

// const ComposedDialCodeSelect = ({ name, ...props }: DialCodeSelectProps) => {
//   if (!isString(name)) {
//     return null;
//   }
//   return (
//     <FormFieldProvider name={name}>
//       <DialCodeSelect {...props} name={name} />
//     </FormFieldProvider>
//   );
// };

// const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupFieldOptions>(
//   function RadioGroup({ options, ...props }, ref) {
//     return (
//       <RadioGroupField {...props} ref={ref}>
//         {options?.map((option) => (
//           // @todo do Radio options also need the ref?
//           <Radio key={option} value={option}>
//             {option}
//           </Radio>
//         ))}
//       </RadioGroupField>
//     );
//   }
// );

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
const BaseField = React.forwardRef<TextInput, BaseFieldProps>(
  (
    props: BaseFieldProps,
    // @todo mergeRefs?
    ref: React.ForwardedRef<any>
  ) => {
    // console.log('ref', ref);

    // const { error, name, onBlur:, onChange, ref } = useFormField();
    // const errorMessage = (error as { message?: string })?.message;

    // const hasError = !!errorMessage;

    // @todo combine handlers, add util
    const combinedProps = {
      ...props,
      // name,
      // onBlur,
      // onChange,
      ref,
      // errorMessage,
      // hasError,
    };

    return isTextFieldOptions(combinedProps) ? (
      <TextField {...combinedProps} />
    ) : isPasswordFieldOptions(combinedProps) ? (
      <PasswordField {...combinedProps} />
    ) : // : isCheckboxFieldOptions(combinedProps) ? (
    //   <CheckboxField {...combinedProps} />
    // ) : isPhoneNumberFieldOptions(combinedProps) ? (
    //   <PhoneNumberField
    //     {...combinedProps}
    //     // DialCodeSelect={ComposedDialCodeSelect}
    //   />
    // ) : isRadioGroupFieldOptions(combinedProps) ? (
    //   <RadioGroup {...combinedProps} />
    // )
    null;
  }
);
// });

// @todo Field is generic enough to be a standalone component with the `Form`
// Field.displayName = 'Authenticator.FieldsView.Field';

// function Field({
//   Field = BaseField,
//   name,
//   validate,
//   ...rest
// }: FieldProps): JSX.Element {
//   return (
//     <FormFieldProvider key={name} name={name} validate={validate}>
//       <Field {...rest} name={name} />
//     </FormFieldProvider>
//   );
// }

function NewField({
  Field = BaseField,
  name,
  // validate,
  ...rest
}: FieldProps): JSX.Element {
  const { control } = useFormContext();

  const { field, fieldState: _ } = useController({
    name,
    control,
    // rules: { required: true },
  });

  // console.log('fieldState', fieldState);

  return <Field key={name} {...field} {...rest} />;

  // TODO: is there a real difference between Controller ve useController?
  // return (
  //   <Controller
  //     control={control}
  //     key={name}
  //     name={name}
  //     render={(field) => <Field {...rest} {...field} />}
  //   />
  // );
}

// this should done in another file
BaseField.displayName = 'Going in a bad direction';

export default NewField;
