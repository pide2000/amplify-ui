import * as React from 'react';

import { AuthenticatorMachineOptions, Prettify } from '@aws-amplify/ui';
import {
  AuthenticatorRouteComponentKey,
  DisplayText,
  Components,
} from '@aws-amplify/ui-react-core-auth';

import { FieldOptions } from './ui';

type Fields = Partial<
  Record<
    AuthenticatorRouteComponentKey,
    FieldOptions[] | ((fields: FieldOptions[]) => FieldOptions[])
  >
>;

type Services = Prettify<
  Omit<Partial<AuthenticatorMachineOptions>, 'formFields'>
>;

export type AuthenticatorProps = {
  // @TODO: `children` and `comps` mutually exclusive typing
  children?: React.ReactNode;
  comps?: Components;
  // defaultValues as means to pass in provider config specfic properties? either way shoud probably have it
  // validationMode:
  displayText?: DisplayText;
  fields?: Fields;
  services?: Services;
};
