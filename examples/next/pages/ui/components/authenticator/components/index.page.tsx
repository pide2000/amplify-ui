import React from 'react';
import { Amplify, Auth } from 'aws-amplify';

import { Authenticator, useAuth } from '@aws-amplify/ui-react-auth';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const MyButton = ({ isDisabled, ...props }: { isDisabled?: boolean }) => {
  return <button {...props} disabled={isDisabled} type="submit" />;
};

const MyForm = (props: {
  children?: React.ReactNode;
  onSubmit?: React.FormEventHandler;
}) => {
  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    console.log('extend onSubmit', e);

    props?.onSubmit(e);
  };

  return (
    <div
      {...props}
      onSubmit={onSubmit}
      style={{ backgroundColor: 'lightblue' }}
    />
  );
};

const MyHeading = ({ children }) => (
  // <Authenticator.Heading />
  <p style={{ backgroundColor: 'teal' }}>{children}</p>
);

const MyFederatedProviders = {
  View: ({ children }) => (
    <div style={{ backgroundColor: 'khaki' }}>{children}</div>
  ),

  Button: ({ children }) => (
    <>
      <p>MY LABEL</p>
      <button style={{ backgroundColor: 'pink' }}>{children}</button>
    </>
  ),
  Icon: ({ provider }) => <p>{provider}</p>,
};

const MyMessage = (props) => <p {...props} />;

const MyRouteLinks = {
  Button: (props) => <button {...props} style={{ backgroundColor: 'white' }} />,
  View: (props) => <div {...props} style={{ backgroundColor: 'lightcoral' }} />,
};

const components = {
  Button: MyButton,
  FederatedProviders: MyFederatedProviders,
  Form: MyForm,
  Heading: MyHeading,
  Message: MyMessage,
  RouteLinks: MyRouteLinks,
};

function App() {
  console.count('Components App render: ');

  const { getIsAuthenticated } = useAuth();
  const formRef = React.useRef();

  const [isSignedin, setIsSignedIn] = React.useState<boolean | undefined>();
  React.useEffect(() => {
    getIsAuthenticated().then(setIsSignedIn);
  });

  return (
    <main>
      {isSignedin ? (
        <>
          <h1>Hello!</h1>
          <button onClick={() => Auth.signOut()}>Sign out</button>
        </>
      ) : (
        <Authenticator
          comps={components}
          services={{ signUpAttributes: ['name'] }}
        />
      )}
    </main>
  );
}

export default App;
