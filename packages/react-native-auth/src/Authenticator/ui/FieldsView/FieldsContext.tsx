import { createFieldsContext } from '@aws-amplify/ui-react-core-auth';
import { FieldOptions } from './types';

const { useFields, withFieldsProvider } =
  createFieldsContext<{ fields?: FieldOptions[] }>();

export { useFields, withFieldsProvider };
