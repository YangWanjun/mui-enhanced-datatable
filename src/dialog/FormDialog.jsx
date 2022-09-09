import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from "prop-types";
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tabs,
  Tab,
  makeStyles,
} from '@material-ui/core';
import Form from '../form/Form';
import SyncButton from '../components/SyncButton';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
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
}));

const FormDialog = forwardRef((props, ref) => {
  const { title, description, schema, layout, handleOk, saveCallback, ...rest } = props;
  const [ open, setOpen ] = useState(false);
  const [ data, setData ] = useState({});
  const [ errors, setErrors ] = useState({});
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ tabsLabel, setTabsLabel ] = useState([]);
  const classes = useStyles();
  const elementsRef = useRef([]);

  useEffect(() => {
    setErrors(props.errors || {});
  }, [props.errors]);
  
  useImperativeHandle(ref, () => ({
    handleOpen: (initial, tabsLabel) => {
      setOpen(true);
      setData(initial);
      setTabsLabel(tabsLabel || []);
    },
  }));

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  const handleLocalOk = () => {
    if (handleOk) {
      let cleaned_data = null;
      if (Array.isArray(data)) {
        cleaned_data = [];
        elementsRef.current.map(subRef => (
          cleaned_data.push(subRef.clean())
        ));
      } else {
        cleaned_data = elementsRef.current[0].clean();
      }
      if (cleaned_data) {
        return handleOk(cleaned_data).then(() => {
          if (saveCallback) {
            saveCallback(cleaned_data);
          }
          handleClose();
        }).catch(errors => {
          setErrors(errors)
        });
      }
    }
    return Promise.resolve();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
              onChange={handleTabChange}
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
                  ref={(el) => (elementsRef.current[index] = el)}
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
            ref={(el) => (elementsRef.current[0] = el)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>取消</Button>
        <SyncButton
          title="確定"
          handleClick={handleLocalOk}
          autoFocus={true}
          color='primary'
        />
      </DialogActions>
    </Dialog>
  );
});

FormDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  schema: PropTypes.array.isRequired,
  layout: PropTypes.array,
  handleOk: PropTypes.func.isRequired,
  saveCallback: PropTypes.func,
  errors: PropTypes.object,
};
FormDialog.defaultProps = {
};
FormDialog.displayName = "FormDialog";

export default FormDialog;
