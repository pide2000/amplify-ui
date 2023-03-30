import React from 'react';
import { Prettify } from '@aws-amplify/ui';

import {
  CheckboxFieldProps as CheckboxFieldPropsBase,
  PasswordFieldProps as PasswordFieldPropsBase,
  PhoneNumberFieldProps as PhoneNumberFieldPropsBase,
  RadioGroupFieldProps as RadioGroupFieldPropsBase,
  SelectFieldProps as SelectFieldPropsBase,
  TextFieldProps as TextFieldPropsBase,
} from '@aws-amplify/ui-react';

import { Validate } from '@aws-amplify/ui-react-core-auth';

// this may be duplicated?
export type FieldControlType =
  | 'checkbox'
  | 'email'
  | 'password'
  | 'radio'
  | 'select'
  | 'tel'
  | 'text';

type WithFieldProps<T extends FieldControlType, P> = Prettify<
  { name: string; type: T; validate?: Validate } & P
>;

export type PhoneNumberFieldOptions = WithFieldProps<
  'tel',
  PhoneNumberFieldPropsBase
>;

export const phoneNumberFieldOptions: PhoneNumberFieldOptions = {
  type: 'tel',
  label: 'no',
  name: 'name',
};

export type CheckboxFieldOptions = WithFieldProps<
  'checkbox',
  CheckboxFieldPropsBase
>;

export type TextFieldOptions = WithFieldProps<
  'text' | 'email',
  TextFieldPropsBase
>;

export type PasswordFieldOptions = WithFieldProps<
  'password',
  PasswordFieldPropsBase
>;

export type SelectFieldOptions = WithFieldProps<'select', SelectFieldPropsBase>;

export type RadioGroupFieldOptions = WithFieldProps<
  'radio',
  RadioGroupFieldPropsBase & { options: string[] }
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

export type FieldProps = FieldOptions & {
  Field?: BaseFieldComponent;
};
