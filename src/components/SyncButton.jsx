import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const userStyles = makeStyles(theme => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
    display: 'inline-block',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function SyncButton(props) {
  const { title, handleClick, ...rest } = props;
  const [ loading, setLoading ] = useState(false);
  const classes = userStyles();

  const onOk = () => {
    if (handleClick) {
      setLoading(true);
      return handleClick().finally(() => {
        setLoading(false);
      });
    } else {
      return Promise.resolve();
    }
  };

  return (
    <div className={classes.wrapper}>
      <Button
        onClick={onOk}
        disabled={loading}
        {...rest}
      >
        {title}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          className={classes.buttonProgress}
        />
      )}
    </div>
  )
}

SyncButton.propTypes = {
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};
SyncButton.defaultProps = {
};

export default SyncButton;