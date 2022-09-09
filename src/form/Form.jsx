import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Tooltip,
  IconButton,
  Button,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { common, form } from '../utils';
import { NonFieldErrors } from "../components";

const useStyles = makeStyles((theme) => ({
  error: {
    color: 'red',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  inlineTitle: {
    borderBottom: '2px solid #555',
    marginTop: theme.spacing(2),
  },
  inlineTable: {
    width: '100%',
  },
  inlineAdd: {
    width: '100%',
    backgroundColor: grey[100],
  },
}));

const Form = forwardRef((props, ref) => {
  const { schema, layout, inlines, checkList, onChanges, onBlurs } = props;
  const [ data, setData ] = useState({});
  const [ errors, setErrors ] = useState({});
  const classes = useStyles();

  useEffect(() => {
    setData(initializeData(props))
  }, [props.data, props.schema]);

  useEffect(() => {
    setErrors(props.errors || {});
  }, [props.data, props.schema]);

  const initializeData = (props) => {
    if (!common.isEmpty(props.data)) {
      return props.data;
    } else if (props.schema) {
      let data = props.data || {};
      props.schema.map(col => {
        if (common.isEmpty(data[col.name]) && col.default !== null && col.default !== undefined) {
          data[col.name] = col.default;
        }
        return true;
      });
      return data;
    } else {
      return {};
    }
  };

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
  //     this.setState({data: this.initializeData(nextProps)});
  //   }
  //   if (JSON.stringify(nextProps.errors) !== JSON.stringify(this.props.errors)) {
  //     this.setState({errors: nextProps.errors});
  //   } else if (JSON.stringify(nextProps.errors) !== JSON.stringify(this.state.errors) && !common.isEmpty(nextProps.errors)) {
  //     // サーバー側エラーが返した場合、初回目は表示できますが。
  //     // ２回目でまたサーバー側エラー発生したら、nextProps.errors === this.props.errorsなので、エラーが表示できなくなる
  //     // だからここでの設定が必要です。
  //     this.setState({errors: nextProps.errors});
  //   }
  // }

  const handleChange = (prefix, inlineIndex) => (name, value, type) => (event) => {  // eslint-disable-line
    const _data = Object.assign({}, data);
    if (prefix && inlineIndex !== undefined && inlineIndex !== null) {
      let formsetData = _data[prefix];
      formsetData[inlineIndex][name] = value;
    } else {
      _data[name] = value;
    }
    setData(_data);

    onChanges.map(method => {
      const _data = Object.assign({}, data);
      if (prefix && inlineIndex !== undefined && inlineIndex !== null) {
        _data[prefix][inlineIndex][name] = value;
      } else {
        _data[name] = value;
      }
      const retVal = method(name, _data, null, prefix, inlineIndex);
      if (retVal) {
        setData(Object.assign(_data, retVal))
      }
      return true;
    });

    // if (this.props.onSchemaChange) {
    //   let data = this.state.data;
    //   data[name] = value;
    //   const retVal = this.props.onSchemaChange(name, data);
    //   if (retVal) {
    //     retVal.then(data => {
    //     });
    //   }
    // }
  };

  const handleBlur = (event, name) => {
    onBlurs.map(method => {
      const _data = Object.assign({}, data);
      const retVal = method(name, _data);
      if (retVal) {
        setData(Object.assign(_data, retVal))
      }
      return true;
    });
  };

  const handleDeleteInline = (prefix, index) => () => {
    let inlineData = data[prefix];
    inlineData.splice(index, 1);
    let inlineErrors = errors[prefix];
    if (inlineErrors) {
      // Indexによるエラーを順次移動する
      delete inlineErrors[index];
      Object.keys(inlineErrors).map(key => {
        if (key > index) {
          const existErrors = inlineErrors[key];
          delete inlineErrors[key];
          inlineErrors[key - 1] = existErrors;
        }
        return true;
      });
    }
    setData(Object.assign({}, data));
    setErrors(Object.assign({}, errors));
  };

  const handleInlineAdd = (prefix, schema) => () => {  // eslint-disable-line
    let inlineData = data[prefix];
    if (Array.isArray(inlineData)) {
      inlineData.push({});
    } else {
      data[prefix] = [];
    }
    setData(Object.assign({}, data));
  };

  const validate = () => {
    let valid = true;
    let errors = {};
    // 項目の定義からチェック
    if (form.validate_by_schema(null, schema, data, errors) === false) {
      valid = false;
    }
    inlines.map(formset => {
      const dataList = data[formset.name];
      if (form.validate_by_schema(formset.name, formset.schema, dataList, errors) === false) {
        valid = false;
      }
      return true;
    });
    // カスタマイズのチェック
    if (valid === true) {
      checkList.map(method => {
        const retVal = method(data);
        if (retVal !== true) {
          valid = false;
          if (Array.isArray(retVal)) {
            retVal.map(item => (
              form.pushError(null, null, item.name, item.message, errors)
            ));
          }
        }
        return true;
      });
    }

    setErrors(Object.assign({}, errors));
    return valid;
  };

  const realtimeData = () => {
    const _data = Object.assign({}, data);
    schema.map(col => {
      if (col.type === 'field') {
        const value = _data[col.name];
        if (Array.isArray(value) && value.length > 0) {
          const item = value[0];
          _data[col.name] = item.value;
        }
      } else if (col.type === 'fields') {
        const value = _data[col.name];
        if (Array.isArray(value) && value.length > 0) {
          let items = [];
          value.map(item => (items.push(item.value)))
          _data[col.name] = items;
        }
      }
      return true;
    });
    return _data;
  };

  useImperativeHandle(ref, () => ({
    clean: () => {
      if (validate() === true) {
        return realtimeData();
      } else {
        return null;
      }
    },
  }));

  let non_field_errors = null;
  if (errors) {
    non_field_errors = errors.non_field_errors;
  }

  return (
    <div>
      <NonFieldErrors errors={non_field_errors} />
      {form.createFormLayout(data, schema, layout, false, false, null, null, null, errors, handleChange, handleBlur)}
      {inlines.map((formset, key) => {
        const init_data_array = data[formset.name];
        return (
          <div key={key}>
            <Typography variant='subtitle1' className={classes.inlineTitle}>{formset.title}</Typography>
            {(Array.isArray(init_data_array) && init_data_array.length > 0) ? (
              <React.Fragment>
                {init_data_array.map((init_data, key2) => {
                  const inlineErrors = errors[formset.name] || {};
                  return (
                    <table key={key2} className={classes.inlineTable}>
                      <tbody>
                        <tr>
                          <td>
                            {form.createFormLayout(
                              init_data,
                              formset.schema,
                              formset.layout,
                              false,
                              true,
                              formset.name,
                              key2,
                              init_data_array,
                              inlineErrors[key2],
                              handleChange,
                              handleBlur,
                            )}
                          </td>
                          {formset.allowDelete !== false ? (
                            <td style={{width: 45}}>
                              <Tooltip title='削除' placement='bottom' enterDelay={300}>
                                <IconButton aria-label="Action" onClick={handleDeleteInline(formset.name, key2)}>
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </td>
                          ) : null}
                        </tr>
                      </tbody>
                    </table>
                  );
                })}
              </React.Fragment>
            ) : null}
            { formset.allowAdd !== false ? (
              <div>
                <Tooltip title='追加' placement='bottom' enterDelay={300}>
                  <Button className={classes.inlineAdd} onClick={handleInlineAdd(formset.name, formset.schema)}>
                    <AddIcon />
                  </Button>
                </Tooltip>
              </div>
            ) : null }
          </div>
        );
      })}
    </div>
  );
});

Form.propTypes = {
  schema: PropTypes.arrayOf(PropTypes.object).isRequired,
  layout: PropTypes.array,
  inlines: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.object,
  onChanges: PropTypes.arrayOf(PropTypes.func),
  onBlurs: PropTypes.arrayOf(PropTypes.func),
  checkList: PropTypes.arrayOf(PropTypes.func),
  // onSchemaChange: PropTypes.func,
  errors: PropTypes.object,
};

Form.defaultProps = {
  layout: [],
  inlines: [],
  data: {},
  onChanges: [],
  onBlurs: [],
  checkList: [],
};

Form.displayName = "Form";

export default Form;
