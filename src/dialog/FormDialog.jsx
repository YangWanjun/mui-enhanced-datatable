import React from 'react';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Form } from '../form/Form';

const styles = theme => ({
  fullScreen: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      margin: 0,
      maxWidth: '100%',
      maxHeight: 'none',
      borderRadius: 0,
    },
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  description: {
    whiteSpace: 'pre-line',
  },
});

class FormDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      data: {},
      errors: props.errors || {},
      loading: false,
    };
  }

  handleOpen = (initial) => {
    this.setState({
      open: true,
      data: initial,
    });
  };

  handleClose = () => {
    this.setState({open: false, errors: {}});
  };

  handleOk = () => {
    if (this.props.handleOk && this._clean) {
      const data = this._clean();
      if (data) {
        this.setState({loading: true});
        this.props.handleOk(data, this.handleClose).then(() => {
          if (this.props.saveCallback) {
            this.props.saveCallback(data);
          }
          this.handleClose();
        }).catch(errors => {
          this.setState({errors});
        }).finally(() => {
          this.setState({loading: false});
        });
      }
    }
  };

  render() {
    const { classes, title, description, schema, layout, ...rest } = this.props;
    const { open, data, errors, loading } = this.state;

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        PaperProps={{className: classes.fullScreen}}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent dividers>
          {description ? (
            <Typography className={classes.description} variant="body2">
              {description}
            </Typography>
          ) : null}
          <Form
            schema={schema}
            layout={layout}
            data={data}
            errors={errors}
            {...rest}
            innerRef={(form) => {this._clean = form && form.clean}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='secondary'>取消</Button>
          <div className={classes.wrapper}>
            <Button
              onClick={this.handleOk}
              autoFocus={true}
              disabled={loading}
              color='primary'
            >確定</Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  schema: PropTypes.array.isRequired,
  layout: PropTypes.array,
  handleOk: PropTypes.func.isRequired,
  saveCallback: PropTypes.func,
};
FormDialog.defaultProps = {
};

export default withStyles(styles)(FormDialog);
