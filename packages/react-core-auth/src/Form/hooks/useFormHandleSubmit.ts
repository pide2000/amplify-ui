import { useFormContext } from 'react-hook-form';

import { FieldValues } from '../types';
import { UseFormHandleSubmit } from './types';

export default function useFormHandleSubmit<
  Values extends FieldValues
>(): UseFormHandleSubmit<Values> {
  const {
    handleSubmit,
    formState: { isValid },
  } = useFormContext<Values>();
  // @TODO: updTe is
  return { handleSubmit, isValid };
}
