import React from 'react';
import { Amplify, Auth } from 'aws-amplify';

import {
  useAuthenticator,
  Authenticator,
  useAuth,
  useFederatedProviders,
} from '@aws-amplify/ui-react-auth';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const totpProps = {
  totpSecretCode: 'Secret!',
  totpIssuer: 'AWSCognito',
  totpUsername: 'username',
};

function App() {
  console.count('Composable App render: ');

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
        <Authenticator>
          <Authenticator.Fields />
          <Authenticator.RouteLinks.View>
            <Authenticator.RouteLinks.Buttons />
            <Authenticator.RouteLinks.Button>
              My Special Route
            </Authenticator.RouteLinks.Button>
          </Authenticator.RouteLinks.View>
          <>MY SWEET UI</>
          <Authenticator.Heading>Override</Authenticator.Heading>
          <Authenticator.FederatedProviders
            providers={[{ provider: 'apple', text: 'apple' }]}
          />
          <Authenticator.SubHeading>Hi</Authenticator.SubHeading>
          <Authenticator.FederatedProviders.View>
            <Authenticator.FederatedProviders.Buttons />
            <Authenticator.FederatedProviders.Button>
              My Special Provider
            </Authenticator.FederatedProviders.Button>
          </Authenticator.FederatedProviders.View>
          <Authenticator.Button />
          <Authenticator.Button variation="warning" type="reset">
            Reset button
          </Authenticator.Button>
          <Authenticator.TOTP.View>
            <Authenticator.TOTP.Loader />
            <Authenticator.TOTP.Button />
            <p>I'm in the middle!</p>
            <Authenticator.TOTP.Image />
          </Authenticator.TOTP.View>
        </Authenticator>
      )}
    </main>
  );
}

export default App;
