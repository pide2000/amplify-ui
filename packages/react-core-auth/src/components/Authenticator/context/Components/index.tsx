import React from 'react';
import { AnyComponent, createContextUtility } from '@aws-amplify/ui-react-core';
import { cloneDeep } from 'lodash';

interface FederatedProviders {
  Button?: AnyComponent;
  Icon?: AnyComponent;
  View?: AnyComponent;
}

interface TOTP {
  Button?: AnyComponent;
  Image?: AnyComponent;
  Loader?: AnyComponent;
  View?: AnyComponent;
}

// interface FormFields {
//   Field?: AnyComponent;
//   View?: AnyComponent;
// }

interface Fields {
  Field?: AnyComponent;
}

interface RouteLinks {
  Button?: AnyComponent;
  View?: AnyComponent;
}

export interface Components {
  Button?: AnyComponent;
  Form?: AnyComponent;
  Heading?: AnyComponent;
  Message?: AnyComponent;
  SubHeading?: AnyComponent;
  FederatedProviders?: FederatedProviders;
  RouteLinks?: RouteLinks;
  TOTP?: TOTP;
  Fields?: Fields;
}

export interface DefaultComponents extends Required<Components> {
  FederatedProviders: Required<FederatedProviders>;
  RouteLinks: Required<RouteLinks>;
  TOTP: Required<TOTP>;
  Fields: Required<Fields>;
}

export const [ComponentsContext, useComponents] = createContextUtility<
  DefaultComponents | undefined,
  DefaultComponents
>({
  errorMessage: 'Wrap in ComponentsProvider',
  initialValue: undefined,
});

export function mergeComponents(
  defaultsBase: DefaultComponents,
  overrides: Components
): DefaultComponents {
  const defaults = cloneDeep(defaultsBase);

  const FederatedProviders = Object.assign(
    defaults.FederatedProviders,
    overrides.FederatedProviders
  );
  // const FormFields = Object.assign(defaults.FormFields, overrides.FormFields);
  const Fields = Object.assign(defaults.Fields, overrides.Fields);
  const RouteLinks = Object.assign(defaults.RouteLinks, overrides.RouteLinks);
  const TOTP = Object.assign(defaults.TOTP, overrides.TOTP);

  return Object.assign(defaults, overrides, {
    FederatedProviders,
    // FormFields,
    Fields,
    RouteLinks,
    TOTP,
  });
}

export function ComponentsProvider({
  children,
  defaults,
  overrides,
}: {
  children?: React.ReactNode;
  defaults: DefaultComponents;
  overrides?: Components;
}): JSX.Element {
  const value = React.useMemo(
    () => (overrides ? mergeComponents(defaults, overrides) : defaults),
    [defaults, overrides]
  );

  return (
    <ComponentsContext.Provider value={value}>
      {children}
    </ComponentsContext.Provider>
  );
}
