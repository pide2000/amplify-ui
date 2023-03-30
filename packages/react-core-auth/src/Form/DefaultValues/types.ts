import { FieldValues, FormProps } from '../types';

export type DefaultValuesContextType<T extends FieldValues = FieldValues> =
  Pick<FormProps<T>, 'defaultValues'>;

export type DefaultValuesProviderProps<T extends FieldValues = FieldValues> =
  Omit<FormProps<T>, 'onReset' | 'onSubmit'>;
