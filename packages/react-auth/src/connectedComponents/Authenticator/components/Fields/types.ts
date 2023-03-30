import React from 'react';
import { Prettify } from '@aws-amplify/ui';

import {
  CheckboxField,
  Flex,
  PasswordField,
  PhoneNumberField,
  RadioGroupField,
  SelectField,
  TextField,
} from '@aws-amplify/ui-react';

import { Validate } from '@aws-amplify/ui-react-core-auth';

// duplciate
export type FieldControlType =
  | 'checkbox'
  | 'email'
  | 'password'
  | 'radio'
  | 'select'
  | 'tel'
  | 'text';

type WithControlType<T extends FieldControlType, P> = Prettify<{ type: T } & P>;

export type PhoneNumberFieldOptions = WithControlType<
  'tel',
  Parameters<typeof PhoneNumberField>[0]
>;

export type CheckboxFieldOptions = WithControlType<
  'checkbox',
  Parameters<typeof CheckboxField>[0]
>;

export type TextFieldOptions = WithControlType<
  'text' | 'email',
  Parameters<typeof TextField>[0]
>;

export type PasswordFieldOptions = WithControlType<
  'password',
  Parameters<typeof PasswordField>[0]
>;

export type SelectFieldOptions = WithControlType<
  'select',
  Parameters<typeof SelectField>[0]
>;

export type RadioGroupFieldOptions = WithControlType<
  'radio',
  Parameters<typeof RadioGroupField>[0] & { options: string[] }
>;

export type BaseFieldProps =
  | TextFieldOptions
  | SelectFieldOptions
  | PasswordFieldOptions
  | PhoneNumberFieldOptions
  | CheckboxFieldOptions
  | RadioGroupFieldOptions;

type BaseFieldComponent<P = {}> = React.ComponentType<
  // @todo should these be the minimal needed props?
  BaseFieldProps & P
>;

export type FieldOptions = BaseFieldProps & {
  name: string;
  validate?: Validate;
};

export type FieldsViewProps = Prettify<Parameters<typeof Flex>[0]>;

export type FieldProps = FieldOptions & {
  Field?: BaseFieldComponent;
};
