/**
 * Wrapper around StyledFirebaseAuth
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { 
  signInOptions, 
  firebaseAuth
} from '../service/firebase';

type Props = {|
  onSignin?: () => void
|};

export default ({ onSignin }: Props) => {

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions,
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
        onSignin && onSignin();
        return false;
      }
    }
  };

  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth()}/>
};
