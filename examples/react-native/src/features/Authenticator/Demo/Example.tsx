import React from 'react';
// import { Button, StyleSheet, View } from 'react-native';
// import {
// Authenticator,
// Authenticator,
// useAuthenticator,
// } from '@aws-amplify/ui-react-native';

import { Authenticator } from '@aws-amplify/ui-react-native-auth';
import { Amplify } from 'aws-amplify';

import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

// function SignOutButton() {
//   const { signOut } = useAuthenticator();
//   return <Button onPress={signOut} title="Sign Out" />;
// }

function App() {
  return (
    <Authenticator />
    // <Authenticator.Provider>
    //   <Authenticator>
    //     <View style={style.container}>
    //       <SignOutButton />
    //     </View>
    //   </Authenticator>
    // </Authenticator.Provider>
  );
}

// const style = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// });

export default App;
