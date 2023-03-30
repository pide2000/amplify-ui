import { Prettify } from '@aws-amplify/ui';
import { Validate } from '../../../../Form';

export type FieldControlType =
  | 'checkbox'
  | 'email'
  | 'password'
  | 'radio'
  | 'select'
  | 'tel'
  | 'text';

export type CommonFieldOptions = {
  defaultDialCode?: string;
  dialCodeList?: string[];
  dialCodeName?: string;
  defaultValue?: string;
  // label: (label: string) => srring | string
  key: string;
  label: string;
  name: string;
  placeholder?: string;
  type?: FieldControlType;
  validate?: Validate;
  autoComplete?: string;
  isRequired?: boolean;
  // should be a discriminated union
  options?: string[];
  value?: string;
};

export type FieldsType<Type extends { fields?: unknown }> = Type extends {
  fields?: infer T;
}
  ? T
  : never;

export type BaseFieldsContextType<T extends { fields?: unknown }> = Prettify<{
  fields?: FieldsType<T>;
}>;

export type FieldsViewSubComponentName = 'Field' | 'Fields';
