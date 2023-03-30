import React from 'react';
import FormProvider from './FormProvider';

import { FormHandle, FormProps } from './types';

const Form = React.forwardRef<FormHandle, FormProps>(function Form(
  { children, defaultValues, ...props },
  ref
): JSX.Element {
  return (
    <FormProvider {...props} defaultValues={defaultValues} ref={ref}>
      {children}
    </FormProvider>
  );
});

export default Form;
