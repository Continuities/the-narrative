/**
 * View for moderating page submissions
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useToApprove, approveDraft } from '../model/page';
import Button, { ButtonContainer } from './Button';
import { ThumbUp, ThumbDown, Close } from '@material-ui/icons';

const useStyles = makeStyles({
  container: {
    width: 'calc(100vw - 80px)',
    height: 'calc(100vh - 80px)',
    display: 'flex',
    flexDirection: 'column'
  },
  page: {
    whiteSpace: 'break-spaces',
    flexGrow: 1,
    overflow: 'auto'
  }
})

type Props = {|
  close: () => void
|};

export default ({ close }: Props) => {
  const styles = useStyles();
  const approveData = useToApprove();
  if (!approveData) {
    return null;
  }
  const { left: narrative, right: toApprove } = approveData;

  const approving = toApprove && toApprove.length > 0 && toApprove[0];

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        { approving 
          ?  approving.text
          : 'Nothing to approve'}
      </div>
      <ButtonContainer>
        { approving && (
          <React.Fragment>
            <Button onClick={() => approveDraft(narrative.id, approving.id, true)}>
              <ThumbUp />
            </Button>
            <Button onClick={() => approveDraft(narrative.id, approving.id, false)}>
              <ThumbDown />
            </Button>
          </React.Fragment>
        )}
        <Button onClick={close}>
          <Close />
        </Button>
      </ButtonContainer>
    </div>
  );
}
