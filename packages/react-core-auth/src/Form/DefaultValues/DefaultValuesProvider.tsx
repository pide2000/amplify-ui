import React from 'react';

import { FieldValues } from '../types';
import { DefaultValuesContext } from './DefaultValuesContext';
import { DefaultValuesProviderProps } from './types';

export default function DefaultValuesProvider<
  T extends FieldValues = FieldValues
>({ children, ...defaultValues }: DefaultValuesProviderProps<T>): JSX.Element {
  return (
    <DefaultValuesContext.Provider value={defaultValues}>
      {children}
    </DefaultValuesContext.Provider>
  );
}
