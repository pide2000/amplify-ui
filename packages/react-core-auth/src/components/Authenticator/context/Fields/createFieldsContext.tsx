import React from 'react';

import {
  AnyComponent,
  createContextUtility,
  SubComponent,
  ViewComponent,
  ViewSubComponents,
  WithContextProps,
} from '@aws-amplify/ui-react-core';
import { isFunction } from '@aws-amplify/ui';

import { useComponentRoute } from '../ComponentRoute';
import { useLoginMechanism, useUnverifiedContactMethods } from '../../hooks';

import getDefaultFields from './getDefaultFields';
import {
  BaseFieldsContextType,
  FieldsType,
  FieldsViewSubComponentName,
} from './types';

function useDefaultFields() {
  const { unverifiedContactMethods } = useUnverifiedContactMethods();
  const { loginMechanism } = useLoginMechanism();
  // const { fieldsText } = useDisplayText()
  const { route } = useComponentRoute();

  const fields = React.useMemo(
    () => getDefaultFields({ loginMechanism, route, unverifiedContactMethods }),
    [loginMechanism, route, unverifiedContactMethods]
  );

  return fields;
}

/**
 * Just requires `Fields`
 * @returns
 */
export default function createFieldsContext<
  Fields extends { fields?: unknown },
  FieldsContextType extends BaseFieldsContextType<Fields> = BaseFieldsContextType<Fields>
>(): {
  FieldsProvider: (props: {
    children?: React.ReactNode;
    fields?: FieldsType<Fields>;
  }) => JSX.Element;
  useFields: () => Required<FieldsContextType>;
  withFieldsProvider: <
    Comp extends AnyComponent,
    SubComponents extends ViewSubComponents<FieldsViewSubComponentName>
  >(
    Component: Comp,
    subComponents: SubComponents
  ) => ((
    props: WithContextProps<FieldsContextType, React.ComponentProps<Comp>> & {
      View?: ViewComponent;
    }
  ) => JSX.Element) & {
    Field: SubComponent<SubComponents['Field']>;
    Fields: SubComponent<SubComponents['Fields']>;
  };
} {
  const [FieldsContext, useFields] = createContextUtility<
    FieldsContextType | null,
    Required<FieldsContextType>
  >({
    errorMessage: 'better message here',
    initialValue: null,
  });

  function FieldsProvider({
    children,
    fields: overrideFields,
  }: {
    children?: React.ReactNode;
    fields?: FieldsType<Fields>;
  }) {
    const defaultFields = useDefaultFields();
    const value = React.useMemo(
      () => ({
        fields: Array.isArray(overrideFields) ? overrideFields : defaultFields,
      }),
      [defaultFields, overrideFields]
    );

    return (
      <FieldsContext.Provider value={value as FieldsContextType}>
        {children}
      </FieldsContext.Provider>
    );
  }

  function withFieldsProvider<
    Comp extends AnyComponent,
    ReturnCompProps extends WithContextProps<
      FieldsContextType,
      React.ComponentProps<Comp>
    > & { View?: ViewComponent },
    SubComponents extends ViewSubComponents<FieldsViewSubComponentName>
  >(
    Component: Comp,
    subComponents: SubComponents
  ): ((props: ReturnCompProps) => JSX.Element) & {
    Field: SubComponent<SubComponents['Field']>;
    Fields: SubComponent<SubComponents['Fields']>;
  } {
    function FieldsView({
      fields,
      View: OverrideView,
      ...props
    }: ReturnCompProps) {
      const View = isFunction(OverrideView) ? OverrideView : Component;

      return (
        <FieldsProvider fields={fields}>
          <View {...props} />
        </FieldsProvider>
      );
    }

    const { Field, Fields } = subComponents;

    FieldsView.Field = Field;
    FieldsView.Fields = Fields;

    FieldsView.displayName = 'Authenticator.FieldsView';

    return FieldsView;
  }

  return { FieldsProvider, useFields, withFieldsProvider };
}
