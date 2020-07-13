/**
 * Main app viewport
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import Frame from './Frame';
import Narrative from './Narrative';
import { useActiveNarrative } from '../model/narrative';

export default () => {
  const narrative = useActiveNarrative();
  return (
    <Frame>
      {narrative ? <Narrative narrative={narrative}/> : null}
    </Frame>
  );
};
