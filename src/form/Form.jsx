import React from "react";
import PropTypes from "prop-types";
import withStyles from "@mui/styles/withStyles";
import {
  Typography,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { grey } from '@mui/material/colors';
import { common } from '../utils';
import { NonFieldErrors } from "./NonFieldErrors";
import { pushError, createFormLayout, validate_by_schema } from "./common";

const styles = (theme) => ({
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
});

class MyForm extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.clean = this.clean.bind(this);
    this.realtimeData = this.realtimeData.bind(this);
    this.state = {
      data: this.initializeData(props),
      errors: props.errors || {},
    };
  }

  initializeData(props) {
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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({data: this.initializeData(nextProps)});
    }
    if (JSON.stringify(nextProps.errors) !== JSON.stringify(this.props.errors)) {
      this.setState({errors: nextProps.errors});
    } else if (JSON.stringify(nextProps.errors) !== JSON.stringify(this.state.errors) && !common.isEmpty(nextProps.errors)) {
      // サーバー側エラーが返した場合、初回目は表示できますが。
      // ２回目でまたサーバー側エラー発生したら、nextProps.errors === this.props.errorsなので、エラーが表示できなくなる
      // だからここでの設定が必要です。
      this.setState({errors: nextProps.errors});
    }
  }

  handleChange = (prefix, inlineIndex) => (name, value, type) => (event) => {
    this.setState((state) => {
      let data = Object.assign({}, state.data);
      if (prefix && inlineIndex !== undefined && inlineIndex !== null) {
        let formsetData = data[prefix];
        formsetData[inlineIndex][name] = value;
      } else {
        data[name] = value;
      }
      return {data: data};
    });

    this.props.onChanges.map(method => {
      let data = this.state.data;
      if (prefix && inlineIndex !== undefined && inlineIndex !== null) {
        data[prefix][inlineIndex][name] = value;
      } else {
        data[name] = value;
      }
      const retVal = method(name, data, null, prefix, inlineIndex);
      if (retVal) {
        this.setState((state) => {
          let data = Object.assign({}, state.data, retVal);
          return {data: data};
        });
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

  handleBlur = (event, name) => {
    this.props.onBlurs.map(method => {
      const data = this.state.data;
      const retVal = method(name, data);
      if (retVal) {
        this.setState((state) => {
          let data = Object.assign({}, state.data, retVal);
          return {data: data};
        });
      }
      return true;
    });
  };

  handleDeleteInline = (prefix, index) => () => {
    let { data, errors } = this.state;
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
    this.setState({data, errors});
  };

  handleInlineAdd = (prefix, schema) => () => {
    let { data } = this.state;
    let inlineData = data[prefix];
    if (Array.isArray(inlineData)) {
      inlineData.push({});
    } else {
      data[prefix] = [];
    }
    this.setState({data});
  };

  validate = () => {
    const { data } = this.state;
    let valid = true;
    let errors = {};
    // 項目の定義からチェック
    if (validate_by_schema(null, this.props.schema, data, errors) === false) {
      valid = false;
    }
    this.props.inlines.map(formset => {
      const dataList = data[formset.name];
      if (validate_by_schema(formset.name, formset.schema, dataList, errors) === false) {
        valid = false;
      }
      return true;
    });
    // カスタマイズのチェック
    if (valid === true) {
      this.props.checkList.map(method => {
        const retVal = method(data);
        if (retVal !== true) {
          valid = false;
          if (Array.isArray(retVal)) {
            retVal.map(item => (
              pushError(null, null, item.name, item.message, errors)
            ));
          }
        }
        return true;
      });
    }

    // const oldErrors = this.props.errors || {};
    errors = Object.assign({}, errors)
    this.setState({errors});
    return valid;
  };

  realtimeData = () => {
    const data = Object.assign({}, this.state.data);
    this.props.schema.map(col => {
      if (col.type === 'field') {
        const value = data[col.name];
        if (Array.isArray(value) && value.length > 0) {
          const item = value[0];
          data[col.name] = item.value;
        }
      } else if (col.type === 'fields') {
        const value = data[col.name];
        if (Array.isArray(value) && value.length > 0) {
          let items = [];
          value.map(item => (items.push(item.value)))
          data[col.name] = items;
        }
      }
      return true;
    });
    return data;
  };

  clean = () => {
    if (this.validate() === true) {
      return this.realtimeData();
    } else {
      return null;
    }
  };

  render() {
    const { classes, schema, layout, inlines } = this.props;
    const { data, errors } = this.state;
    let non_field_errors = null;
    if (errors) {
      non_field_errors = errors.non_field_errors;
    }

    return (
      <div>
        <NonFieldErrors errors={non_field_errors} />
        {createFormLayout(data, schema, layout, false, false, null, null, null, errors, this.handleChange, this.handleBlur)}
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
                              {createFormLayout(
                                init_data,
                                formset.schema,
                                formset.layout,
                                false,
                                true,
                                formset.name,
                                key2,
                                init_data_array,
                                inlineErrors[key2],
                                this.handleChange,
                                this.handleBlur,
                              )}
                            </td>
                            {formset.allowDelete !== false ? (
                              <td style={{width: 45}}>
                                <Tooltip title='削除' placement='bottom' enterDelay={300}>
                                  <IconButton aria-label="Action" onClick={this.handleDeleteInline(formset.name, key2)}>
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
                    <Button className={classes.inlineAdd} onClick={this.handleInlineAdd(formset.name, formset.schema)}>
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
  }

}

MyForm.propTypes = {
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

MyForm.defaultProps = {
  layout: [],
  inlines: [],
  data: {},
  onChanges: [],
  onBlurs: [],
  checkList: [],
};

const Form = withStyles(styles)(MyForm);
export {Form};
