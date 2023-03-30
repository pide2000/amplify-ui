import {
  UseFormHandleSubmit as BaseUseFormHandleSubmit,
  UseFormReset as BaseUseFormReset,
} from 'react-hook-form';

import { FieldValues } from '../types';

export type UseFormHandleSubmit<T extends FieldValues = FieldValues> = {
  handleSubmit: BaseUseFormHandleSubmit<T>;
  isValid: boolean;
};

export type UseFormReset<T extends FieldValues = FieldValues> = {
  reset: BaseUseFormReset<T>;
};

// export type UseDefaultValues<> = {}
