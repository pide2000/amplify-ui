import { createContextUtility } from '@aws-amplify/ui-react-core';
import { DefaultValuesContextType } from './types';

const [DefaultValuesContext, useDefaultValues] = createContextUtility<
  DefaultValuesContextType | null,
  DefaultValuesContextType
>({ initialValue: null });

export { DefaultValuesContext, useDefaultValues };
