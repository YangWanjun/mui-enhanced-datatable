import React from 'react';
import PropTypes from "prop-types";
import withStyles from "@mui/styles/withStyles";
import { Button, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';

const styles = theme => ({
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
});

class SyncButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  onOk = () => {
    const { handleClick } = this.props;
    if (handleClick) {
      this.setState({loading: true});
      handleClick().finally(() => {
        this.setState({loading: false});
      });
    }
  };

  render() {
    const { classes, title, handleClick, ...rest } = this.props;
    const { loading } = this.state;

    return (
      <div className={classes.wrapper}>
        <Button
          onClick={this.onOk}
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
}

SyncButton.propTypes = {
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};
SyncButton.defaultProps = {
};

export default withStyles(styles)(SyncButton);