import { createContextUtility } from '@aws-amplify/ui-react-core';

import { DisplayText, DefaultDisplayText } from './types';

const [DisplayTextContext, useDisplayText] = createContextUtility<
  DisplayText | null,
  DefaultDisplayText
>({ errorMessage: 'Not in a `DisplayTextProvider`', initialValue: null });

const { Provider: DisplayTextProvider } = DisplayTextContext;

export { DisplayTextContext, DisplayTextProvider, useDisplayText };
