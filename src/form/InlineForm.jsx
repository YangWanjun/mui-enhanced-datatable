import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";
import {
  Tooltip,
  IconButton,
  Button,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { grey } from '@material-ui/core/colors';
import { common, form } from "../utils";
import { NonFieldErrors } from "../components";

const useStyles = makeStyles({
  inlineTable: {
    width: '100%',
  },
  alternativeInline: {
    backgroundColor: grey[100],
  },
  error: {
    color: 'red',
  },
});

const InlineForm = forwardRef((props, ref) => {
  const { schema, layout, allowAdd, allowDelete, new_line_schema, checkList, onChanges } = props;
  const [ data, setData ] = useState({});
  const [ errors, setErrors ] = useState({});
  const classes = useStyles();

  useEffect(() => {
    setData(initializeData(props))
  }, [props.data, props.schema]);

  useEffect(() => {
    setErrors(props.errors || {});
  }, [props.data, props.schema]);

  useImperativeHandle(ref, () => ({
    clean: () => {
      return form.clean_form(validate, data, schema);
    },
  }));

  const initializeData = (props) => {
    if (props.schema) {
      let _data = props.data || [];
      _data.map(row => (
        props.schema.map(col => {
          if (common.isEmpty(row[col.name]) && col.default !== null && col.default !== undefined) {
            row[col.name] = col.default;
          }
          return true;
        })
      ))
      return _data;
    } else {
      return [];
    }
  };

  const handleDeleteInline = index => () => {
    const _data = data.slice();
    const _errors = Object.assign({}, errors);
    _data.splice(index, 1);
    if (_errors) {
      // Indexによるエラーを順次移動する
      delete _errors[index];
      Object.keys(_errors).map(key => {
        if (key > index) {
          const existErrors = _errors[key];
          delete _errors[key];
          _errors[key - 1] = existErrors;
        }
        return true;
      });
    }
    setData(_data);
    setErrors(_errors);
  };

  const handleAppendNew = () => {
    const _data = data.slice();
    _data.push({is_new: true});
    setData(_data);
  };

  const handleChange = (prefix, inlineIndex) => (name, value, type) => (event) => {  // eslint-disable-line
    const _data = data.slice();
    _data[inlineIndex][name] = value;
    setData(_data);

    onChanges.map(method => {
      const _data = data.slice();
      _data[inlineIndex][name] = value;
      const retVal = method(name, _data, null, prefix, inlineIndex);
      if (retVal) {
        setData(retVal);
      }
      return true;
    });
  };

  const createAddComponent = () => {
    return (
      <div>
        <Button fullWidth onClick={handleAppendNew}>
          <AddIcon />
        </Button>
      </div>
    );
  };

  const validate = () => {
    let _errors = {};
    const valid = form.validate_form(data, schema, checkList, errors);

    const oldErrors = props.errors || {};
    _errors = Object.assign(oldErrors, _errors)
    setErrors(_errors);
    return valid;
  };

  const non_field_errors = errors ? errors.non_field_errors : null;

  if (Array.isArray(data) && data.length > 0) {
    return (
      <div>
        <NonFieldErrors errors={non_field_errors} />
        {data.map((row_data, key) => (
          <div key={key}className={key % 2 ? classes.alternativeInline : null}>
            <table className={classes.inlineTable}>
              <tbody>
                <tr>
                  <td>
                    {form.createFormLayout(
                      row_data,
                      row_data.is_new === true ? new_line_schema : schema,
                      layout,
                      false,
                      true,
                      null,
                      key,
                      data,
                      errors[key],
                      handleChange
                    )}
                  </td>
                  { allowDelete !== false ? (
                    <td style={{width: 45}}>
                      <Tooltip title='削除' placement='bottom' enterDelay={300}>
                        <IconButton aria-label="Action" onClick={handleDeleteInline(key)}>
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </td>
                  ) : null }
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        { allowAdd !== false ? createAddComponent() : null }
      </div>
    );
  } else {
    return (
      <>
        { allowAdd !== false ? createAddComponent() : null }
      </>
    )
  }
});

InlineForm.propTypes = {
  schema: PropTypes.array.isRequired,
  layout: PropTypes.array,
  data: PropTypes.array,
  onChanges: PropTypes.arrayOf(PropTypes.func),
  allowAdd: PropTypes.bool,
  allowDelete: PropTypes.bool,
  new_line_schema: PropTypes.array,
  checkList: PropTypes.array,
  errors: PropTypes.object,
};

InlineForm.defaultProps = {
  layout: [],
  data: [],
  onChanges: [],
  allowAdd: true,
  allowDelete: true,
};

InlineForm.displayName = "InlineForm";

export default InlineForm;
