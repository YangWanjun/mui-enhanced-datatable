import React from 'react';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core';
import { Form } from '../form/Form';
import SyncButton from '../form/SyncButton';

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
  description: {
    whiteSpace: 'pre-line',
  },
  tabSep: {
    marginTop: theme.spacing(1),
  }
});

class FormDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      data: {},
      errors: props.errors || {},
      tabIndex: 0,
      tabsLabel: [],
    };
  }

  handleOpen = (initial, tabsLabel) => {
    this.setState({
      open: true,
      data: initial,
      tabsLabel: tabsLabel || [],
    });
  };

  handleClose = () => {
    this.setState({open: false, errors: {}});
  };

  handleTabChange = (event, index) => {
    this.setState({ tabIndex: index });
  };

  handleOk = () => {
    const { data } = this.state;
    const { handleOk, saveCallback } = this.props;
    if (handleOk) {
      let cleaned_data = null;
      if (this._clean) {
        cleaned_data = this._clean();
      } else if (Array.isArray(data)) {
        cleaned_data = [];
        for (let i=0; i < data.length; i++) {
          cleaned_data.push(this[`_clean_${i}`]());
        }
      }
      if (cleaned_data) {
        return handleOk(cleaned_data, this.handleClose).then(() => {
          if (saveCallback) {
            saveCallback(cleaned_data);
          }
          this.handleClose();
        }).catch(errors => {
          this.setState({errors});
        });
      }
    }
    return Promise.resolve();
  };

  render() {
    const { classes, title, description, schema, layout, ...rest } = this.props;
    const { open, data, errors, tabIndex, tabsLabel } = this.state;

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
          {Array.isArray(data) ? (
            <div>
              <Tabs
                value={tabIndex}
                onChange={this.handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs"
              >
                {data.map((item, index) => (
                  <Tab
                    key={index}
                    label={(tabsLabel && tabsLabel.length > index) ? tabsLabel[index] : index + 1}
                    id={`scrollable-auto-tab-${index}`}
                    aria-controls={`scrollable-auto-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
              {data.map((item, index) => (
                <div
                  key={index}
                  role="tabpanel"
                  hidden={tabIndex !== index}
                  id={`scrollable-auto-tab-${index}`}
                  aria-labelledby={`scrollable-auto-tabpanel-${index}`}
                  className={classes.tabSep}
                >
                  <Form
                    schema={schema}
                    layout={layout}
                    data={item}
                    errors={errors}
                    {...rest}
                    innerRef={(form) => {this[`_clean_${index}`] = form && form.clean}}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Form
              schema={schema}
              layout={layout}
              data={data}
              errors={errors}
              {...rest}
              innerRef={(form) => {this._clean = form && form.clean}}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='secondary'>取消</Button>
          <SyncButton
            title="確定"
            handleClick={this.handleOk}
            autoFocus={true}
            color='primary'
          />
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
