import React from 'react';
import {
  DefaultValues as BaseDefaultValues,
  UseFormHandleSubmit,
  UseFormReset,
} from 'react-hook-form';

import { WithContextProps } from '@aws-amplify/ui-react-core';

export type FieldValues = Record<string, string>;

export type DefaultValues<T extends FieldValues = FieldValues> =
  BaseDefaultValues<T>;

export type HandleSubmit<T extends FieldValues = FieldValues> =
  UseFormHandleSubmit<T>;

export type OnReset<T extends FieldValues = FieldValues> = UseFormReset<T>;

export type OnSubmit<T extends FieldValues = FieldValues> = ReturnType<
  HandleSubmit<T>
>;

export type FormHandle<T extends FieldValues = FieldValues> = {
  getValues: () => T;
  reset: UseFormReset<T>;
};

export type FormProviderProps<T extends FieldValues = FieldValues> = {
  children?: React.ReactNode;
  defaultValues?: DefaultValues<T>;
  onReset?: OnReset<T>;
  onSubmit?: OnSubmit<T>;
  validationMode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
};

export type FormProps<T extends FieldValues = FieldValues> =
  FormProviderProps<T>;

export type FormViewContextType<T extends FieldValues = FieldValues> = {
  handleSubmit?: HandleSubmit<T>;
  isDisabled: boolean;
  onSubmit?: OnSubmit<T>;
};

export type WithForm<P> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<FormHandle>
>;

export type FormViewProps<T extends FieldValues = FieldValues> = Omit<
  FormProps<T>,
  'defaultValues'
>;

export type WithFormProps<P> = WithContextProps<FormViewProps, P>;
