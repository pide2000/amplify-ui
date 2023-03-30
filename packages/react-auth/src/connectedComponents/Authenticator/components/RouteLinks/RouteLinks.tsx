import * as React from 'react';
import { useComponents, useLinks } from '@aws-amplify/ui-react-core-auth';

function View(props: { children?: React.ReactNode }): JSX.Element {
  const {
    RouteLinks: { View: Component },
  } = useComponents();
  return <Component {...props} />;
}

function Button(props: {
  children?: React.ReactNode;
  onClick?: React.ReactNode;
}): JSX.Element {
  const {
    RouteLinks: { Button: Component },
  } = useComponents();
  return <Component {...props} />;
}

function Buttons(): JSX.Element | null {
  const { links } = useLinks();

  return (
    <>
      {links?.map(({ handleAction, text, type }) =>
        text ? (
          <Button onClick={handleAction} key={type}>
            {text}
          </Button>
        ) : null
      )}
    </>
  );
}

function RouteLinks(): JSX.Element | null {
  const { links } = useLinks();

  if (!links) {
    return null;
  }

  return (
    <View>
      <Buttons />
    </View>
  );
}

export default Object.assign(RouteLinks, { Button, Buttons, View });
