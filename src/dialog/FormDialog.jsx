import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@material-ui/core';
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
  }
});

class FormDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      data: {},
    };
  }

  handleOpen = (initial) => {
    this.setState({
      open: true,
      data: initial,
    });
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleOk = () => {
    if (this.props.handleOk && this._clean) {
      const data = this._clean();
      if (data) {
        this.props.handleOk(data).then(json => {
          
        });
      }
    }
  };

  render() {
    const { classes, title, schema, errors } = this.props;
    const { open, data } = this.state;

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
          <Form
            schema={schema}
            data={data}
            errors={errors}
            innerRef={(form) => {this._clean = form && form.clean}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='secondary'>キャンセル</Button>
          <Button onClick={this.handleOk} autoFocus={true} color='primary'>確定</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(FormDialog);
