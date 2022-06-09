import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Typography,
} from '@material-ui/core';
import { constant } from '../utils';
import { SyncButton } from '../components';

function ConfirmDialog(props) {
  const { title, onOk, anchorEl } = props;
  const [ open, setOpen ] = useState(false);
  const [ content, setContent ] = useState(null);

  React.useEffect(() => {
    anchorEl.current = handleOpen;
    return () => {
      anchorEl.current = null;
    }
  }, [])

  const handleOpen = (content) => {
    setOpen(true);
    setContent(content);
  };

  const handleCancel = () => {
    setOpen(false);
  }

  const handleOk = () => {
    if (onOk) {
      return onOk().then(() => handleCancel())
    } else {
      return Promise.resolve();
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
    >
      <DialogTitle id="confirmation-dialog-title">{ title }</DialogTitle>
      <DialogContent>
        {content ? (
          null
        ) : constant.INFO.DELETE_CONFIRM}
        <Typography style={{whiteSpace: 'pre-line'}}>
          {content}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          取消
        </Button>
        <SyncButton
          title="確定"
          handleClick={handleOk}
          color="primary"
        />
      </DialogActions>
    </Dialog>
  )
}

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  anchorEl: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default ConfirmDialog;
