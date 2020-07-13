/**
 * Main view for active narrative pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { usePages } from '../model/page';
import PageEditor from './PageEditor';

import type { Page } from '../model/page';
import type { Narrative } from '../model/narrative';

const useStyles = makeStyles({
  page: {
    fontSize: '24px',
    lineHeight: '1.5',
    margin: '20px 0'
  },
  container: {
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'center'
  }
});

const PageView = ({ page }: { page: Page }) => {
  const styles = useStyles();
  return (
    <div className={styles.page}>
      {page.text}
    </div>
  );
};

// No idea why ESLint is freaking out here
// eslint-disable-next-line react/prop-types
const Prompt = ({ narrative }: { narrative: Narrative }) => {
  const styles = useStyles();
  // eslint-disable-next-line react/prop-types
  switch (narrative.status) {
  case 'DRAFT': 
    return (
      <div className={styles.container}>
        {/* eslint-disable-next-line react/prop-types */}
        <PageEditor narrativeId={narrative.id} pageNumber={narrative.canonLength + 1} />
      </div>
    );
  case 'VOTE': 
    return 'TODO: Voting';
  }
  
  return null;
};

type Props = {|
  narrative: Narrative
|};

export default ({ narrative }: Props) => {
  const styles = useStyles();
  const pages:Array<Page> = usePages(narrative.id) || [];
  if (!pages.length) {
    return (
      <div className={styles.page}>
        The page is blank.
      </div>
    );
  }

  return (
    <React.Fragment>
      { pages.map(page => <PageView page={page} key={page.number} />) }
      <Prompt narrative={narrative} />
    </React.Fragment>
  );
};
