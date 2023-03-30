import { createContextUtility } from '@aws-amplify/ui-react-core';
import { FormFieldContextType } from './types';

const [FormFieldContext, useFormField] = createContextUtility<
  FormFieldContextType | null,
  FormFieldContextType
>({ initialValue: null });

export { FormFieldContext, useFormField };
