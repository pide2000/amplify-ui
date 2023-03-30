import * as React from 'react';

import { configureComponent } from '@aws-amplify/ui';
import {
  AuthenticatorProvider,
  DisplayTextProvider,
  ComponentRouteProvider,
  ComponentsProvider,
  withForm,
} from '@aws-amplify/ui-react-core-auth';

import { VERSION } from '../../version';

import { defaults } from './ui';

import {
  Button,
  FederatedProviders,
  Form,
  // FormFields,
  Fields,
  FieldsProvider,
  Heading,
  Message,
  RouteLinks,
  SubHeading,
  TOTPProvider,
  TOTP,
} from './components';

import { AuthenticatorProps } from './types';
import withRenderCount from './withRenderCount';

const WrappedAuthenticatorProvider = withRenderCount(AuthenticatorProvider, {
  label: (count) => `AuthenticatorProvider Render: ${count}`,
});

const WrappedFormProvider = withRenderCount(withForm(Form), {
  displayName: 'FormProvider',
});

const configure = () =>
  configureComponent({
    packageName: '@aws-amplify/ui-react',
    version: VERSION,
  });

function Authenticator({
  children,
  comps,
  displayText: overrideDisplayText,
  services,
}: AuthenticatorProps): JSX.Element | null {
  if (children && comps) {
    throw new Error(
      'The `children` and `components` props are mutually exclusive.'
    );
  }

  React.useEffect(configure, []);

  return (
    <WrappedAuthenticatorProvider {...services}>
      {/* Pu FormProvder here, there's no way to combine the default/override with the provider. group all the other providers */}
      {/* REALLY I HAVE THOUGHT ABT THIS SO MCUH */}
      <ComponentRouteProvider>
        <ComponentsProvider defaults={defaults} overrides={comps}>
          <DisplayTextProvider displayText={overrideDisplayText}>
            <TOTPProvider>
              <FieldsProvider>
                <WrappedFormProvider>
                  {children ? (
                    children
                  ) : (
                    <>
                      <Heading />
                      <SubHeading />
                      <FederatedProviders />
                      <TOTP />
                      <Fields />
                      <Message />
                      <Button />
                      <RouteLinks />
                    </>
                  )}
                </WrappedFormProvider>
              </FieldsProvider>
            </TOTPProvider>
          </DisplayTextProvider>
        </ComponentsProvider>
      </ComponentRouteProvider>
    </WrappedAuthenticatorProvider>
  );
}

// Authenticator.Form? = WrappedFormProvider;

Authenticator.Button = Button as typeof defaults.Button;
Authenticator.FederatedProviders =
  FederatedProviders as typeof defaults.FederatedProviders & {
    Buttons: () => JSX.Element;
  };

Authenticator.Fields = Fields as typeof defaults.Fields & {
  Fields: () => JSX.Element;
};

Authenticator.Heading = Heading as typeof defaults.Heading;
Authenticator.RouteLinks = RouteLinks as typeof defaults.RouteLinks & {
  Buttons: () => JSX.Element;
};
Authenticator.SubHeading = SubHeading as typeof defaults.SubHeading;
Authenticator.TOTP = TOTP as typeof defaults.TOTP;

export default Authenticator;
