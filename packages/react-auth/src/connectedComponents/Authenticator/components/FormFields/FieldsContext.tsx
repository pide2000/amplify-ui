import { createFieldsContext } from '@aws-amplify/ui-react-core-auth';
import { FieldOptions } from './types';

const { FieldsProvider, useFields, withFieldsProvider } =
  createFieldsContext<{ fields?: FieldOptions[] }>();

export { FieldsProvider, useFields, withFieldsProvider };
