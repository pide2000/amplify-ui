import React from 'react';

import {
  useComponentRoute,
  useComponents,
  useSubmit,
} from '@aws-amplify/ui-react-core-auth';

// minimum props needed for an override
type FormProps = {
  children?: React.ReactNode;
  onSubmit?: () => void;
};

export default function Form({
  children,
  onSubmit,
  ...props
}: FormProps): JSX.Element {
  const { onSubmit: _onSubmit } = useSubmit();
  const { route } = useComponentRoute();

  const { Form: Component } = useComponents();

  return (
    <Component
      {...props}
      // update `key` on `route` update to ensure a remount
      key={route}
      onSubmit={onSubmit ?? _onSubmit}
    >
      {children}
    </Component>
  );
}
