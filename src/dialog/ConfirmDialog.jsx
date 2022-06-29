import React, { forwardRef, useImperativeHandle, useState } from 'react';
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

const ConfirmDialog = forwardRef((props, ref) => {
  const { title, onOk } = props;
  const [ open, setOpen ] = useState(false);
  const [ content, setContent ] = useState(null);

  useImperativeHandle(ref, () => ({
    handleOpen: (content) => {
      setOpen(true);
      setContent(content);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  }

  const handleOk = () => {
    if (onOk) {
      return onOk().then(() => handleClose())
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
        <Button onClick={handleClose} color="secondary">
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
});

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default ConfirmDialog;
