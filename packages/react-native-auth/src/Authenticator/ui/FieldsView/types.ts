import React from 'react';
import { ViewProps } from 'react-native';
import { Prettify } from '@aws-amplify/ui';

import { Validate } from '@aws-amplify/ui-react-core-auth';
import {
  CheckboxProps,
  PasswordFieldProps,
  PhoneNumberFieldProps,
  RadioGroupProps,
  TextFieldProps,
} from '@aws-amplify/ui-react-native';

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
  PhoneNumberFieldProps
>;

export type CheckboxFieldOptions = WithControlType<
  'checkbox',
  CheckboxProps<boolean>
>;

export type TextFieldOptions = WithControlType<
  'text' | 'email',
  TextFieldProps
>;

export type PasswordFieldOptions = WithControlType<
  'password',
  PasswordFieldProps
>;

export type RadioGroupFieldOptions = WithControlType<
  'radio',
  RadioGroupProps<unknown> & { name: string; options?: string[] }
>;

export type BaseFieldProps = TextFieldOptions | PasswordFieldOptions;
// | PhoneNumberFieldOptions
// | CheckboxFieldOptions
// | RadioGroupFieldOptions;

type BaseFieldComponent<P = {}> = React.ComponentType<
  // @todo should these be the minimal needed props?
  BaseFieldProps & P
>;

export type FieldOptions = BaseFieldProps & {
  name: string;
  validate?: Validate;
};

export type FieldsViewProps = ViewProps;

export type FieldProps = FieldOptions & {
  Field?: BaseFieldComponent;
};
