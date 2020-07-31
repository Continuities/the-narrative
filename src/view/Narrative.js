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
import VoteList from './VoteList';

import type { Page } from '../model/page';
import type { Narrative } from '../model/narrative';

const useStyles = makeStyles({
  page: {
    fontSize: '24px',
    lineHeight: '1.5',
    margin: '20px 0',
    whiteSpace: 'break-spaces'
  },
  container: {
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'center'
  },
  pageNumber: {
    fontSize: '20px',
    textAlign: 'center',
    margin: '10px 0'
  }
});

const PageView = ({ page }: { page: Page }) => {
  const styles = useStyles();
  return (
    <div className={styles.page}>
      <div className={styles.pageNumber}>- {page.number} -</div>
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
      <React.Fragment>
        {/* eslint-disable-next-line react/prop-types */}
        <div className={styles.pageNumber}>- {narrative.canonLength + 1} -</div>
        <div className={styles.pageNumber}>Contribute:</div>
        <div className={styles.container}>
          {/* eslint-disable-next-line react/prop-types */}
          <PageEditor narrativeId={narrative.id} pageNumber={narrative.canonLength + 1} />
        </div>
      </React.Fragment>
    );
  case 'VOTE': 
    return (
      <React.Fragment>
        {/* eslint-disable-next-line react/prop-types */}
        <div className={styles.pageNumber}>- {narrative.canonLength + 1} -</div>
        <div className={styles.pageNumber}>Vote:</div>
        <div className={styles.container}>
          <VoteList narrative={narrative}/>
        </div>
      </React.Fragment>
    );
  }
  
  return null;
};

type Props = {|
  narrative: Narrative
|};

export default ({ narrative }: Props) => {
  const pages:Array<Page> = usePages(narrative.id) || [];
  return (
    <React.Fragment>
      { pages.map(page => <PageView page={page} key={page.number} />) }
      <Prompt narrative={narrative} />
    </React.Fragment>
  );
};
