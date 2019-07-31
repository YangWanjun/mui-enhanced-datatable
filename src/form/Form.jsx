import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Typography,
  Grid,
  Tooltip,
  IconButton,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import ControlCreateor from './ControlCreator';
import { common, constant } from '../utils';

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
  }
});

class MyForm extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = { 
      data: this.initialize(props),
      errors: props.errors || {},
    };
  }

  initialize(props) {
    if (props.schema) {
      let data = props.data || {};
      props.schema.map(col => {
        if (common.isEmpty(data[col.name]) && col.default) {
          data[col.name] = col.default;
        }
        return true;
      });
      return data;
    } else {
      return {};
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.errors) !== JSON.stringify(this.props.errors)) {
      this.setState({errors: nextProps.errors});
    }
  }

  handleChange = (prefix, inlineIndex) => (name, value, type) => (event) => {
    this.setState((state) => {
      let data = state.data;
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
      data[name] = value;
      const retVal = method(name, data);
      if (retVal) {
        this.setState((state) => {
          let data = Object.assign({}, state.data, retVal);
          return {data: data};
        });
      }
      return true;
    });
  }

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
    if (this.validate_by_schema(null, null, this.props.schema, data, errors) === false) {
      valid = false;
    }
    this.props.inlines.map(formset => {
      const dataList = data[formset.name];
      dataList.map((inlineData, index) => {
        if (this.validate_by_schema(formset.name, index, formset.schema, inlineData, errors) === false) {
          valid = false;
        }
        return true;
      });
      return true;
    });
    // カスタマイズのチェック
    this.props.checkList.map(method => {
      const retVal = method(data);
      if (retVal !== true) {
        valid = false;
        retVal.map(item => (
          this.pushError(null, null, item.name, item.message, errors)
        ));
      }
      return true;
    });

    this.setState({errors});
    return valid;
  };

  validate_by_schema = (prefix, index, schema, data, errors) => {
    let valid = true;
    schema.map(col => {
      const name = col.name;
      const value = data[name];
      if (col.required === true) {
        // 必須項目チェック
        if (value === null || value === '' || value === undefined || (typeof value === 'object' && common.isEmpty(value))) {
          valid = false;
          this.pushError(prefix, index, name, common.formatStr(constant.ERROR.REQUIRE_FIELD, {name: col.label}), errors);
        }
      } else if (value && col.regex) {
        // 正規表現チェック
        const regex = new RegExp(col.regex);
        if (regex.test(value) === false) {
          this.pushError(prefix, index, name, constant.ERROR.INVALID_DATA, errors);
        }
      }
      return true;
    });
    return valid;
  };

  pushError = (prefix, index, name, error, errors) => {
    let newErrors = errors;
    if (prefix && index !== undefined && index !== null) {
      let inlineErrors = {};
      if (prefix in errors) {
        inlineErrors = errors[prefix];
      } else {
        inlineErrors = {};
        errors[prefix] = inlineErrors;
      }
      if (index in inlineErrors) {
        newErrors = inlineErrors[index];
      } else {
        newErrors = {};
        inlineErrors[index] = newErrors;
      }
    }
    if (name in newErrors) {
      newErrors[name].push(error);
    } else {
      newErrors[name] = [error];
    }
  };

  clean = () => {
    if (this.validate() === true) {
      let data = Object.assign({}, this.state.data);
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
    } else {
      return null;
    }
  };

  createFormLayout(data, schema, layout, isSingleLine, prefix, inlineIndex) {
    let control = null;
    if (common.isEmpty(layout)) {
      let colSpan = 12;
      if (isSingleLine === true) {
        colSpan = Math.floor(12 / schema.length);
      }
      control = (
        <Grid container>
          {schema.map((col, key) => (
            this.createFormField(col, key, colSpan, data, prefix, inlineIndex)
          ))}
        </Grid>
      );
    } else {
      control = (
        <Grid container>
          {layout.map((row, key) => (
            this.createRowLayout(row, key, data, prefix, inlineIndex)
          ))}
        </Grid>
      );
    }
    return control;
  }

  createRowLayout(row, key, data, prefix, inlineIndex) {
    const { schema } = this.props;
    if (typeof row === 'string') {
      const col = common.getFromList(schema, 'name', row);
      return col ? this.createFormField(col, row, 12, data, prefix, inlineIndex) : null;
    } else if (Array.isArray(row)) {
      const colSpan = Math.floor(12 / row.length);
      return (
        <React.Fragment key={key}>
          {row.map((fieldName, key) => {
            const col = common.getFromList(schema, 'name', fieldName);
            return col ? this.createFormField(col, key, colSpan, data, prefix, inlineIndex) : null;
          })}
        </React.Fragment>
      );
    }
    return null;
  }

  createFormField(col, key, colSpan, data, prefix, inlineIndex) {
    let errors = null;
    if (prefix) {
      if (this.state.errors[prefix] && inlineIndex in this.state.errors[prefix]) {
        errors = this.state.errors[prefix][inlineIndex][col.name];
      }
    } else {
      errors = this.state.errors[col.name];
    }
    if (col.type === 'cascade') {
      return (
        <ControlCreateor
          key={key}
          column={col}
          data={data}
          handleChange={this.handleChange(prefix, inlineIndex)}
          wrapper={{element: Grid, props: {xs: 12, sm: 12, md: colSpan, item: true}}}
          errors={errors}
        />
      );
    } else {
      const choices = data[col.name + '_choices'];
      let value = data[col.name];
      if (col.type === 'choices' && choices) {
        // 複数選択時、選択肢はデータから取得する場合
        col['choices'] = choices;
        if (common.isEmpty(choices)) {
          value = null;
          data[col.name] = null;
        }
      }
      return (
        <Grid item key={key} xs={12} sm={12} md={colSpan}>
          <ControlCreateor
            name={col.name} 
            column={col} 
            value={value}
            data={data}
            label={col.label}
            placeholder={col.help_text}
            errors={errors}
            handleBlur={this.handleBlur}
            handleChange={this.handleChange(prefix, inlineIndex)}
          />
        </Grid>
      );
    }
  }

  render() {
    const { classes, schema, layout, inlines } = this.props;
    const { data } = this.state;
    const { non_field_errors } = this.state.errors;

    return (
      <div>
        {Array.isArray(non_field_errors) && non_field_errors.length > 0 ? (
          <ul className={classes.error}>
            {non_field_errors.map((error, key) => (
              <li key={key}>
                {error}
              </li>
            ))}
          </ul>
        ) : null}
        {this.createFormLayout(data, schema, layout, false, null, null)}
        {inlines.map((formset, key) => {
          const init_data_array = data[formset.name];
          return (
            <div key={key}>
              <Typography variant='subtitle1' className={classes.inlineTitle}>{formset.title}</Typography>
              {(Array.isArray(init_data_array) && init_data_array.length > 0) ? (
                <React.Fragment>
                  {init_data_array.map((init_data, key2) => (
                    <table key={key2} className={classes.inlineTable}>
                      <tbody>
                        <tr>
                          <td>
                            {this.createFormLayout(init_data, formset.schema, formset.layout, true, formset.name, key2)}
                            </td>
                          <td style={{width: 45}}>
                            <Tooltip title='削除' placement='bottom' enterDelay={300}>
                              <IconButton aria-label="Action" onClick={this.handleDeleteInline(formset.name, key2)}>
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ))}
                </React.Fragment>
              ) : null}
              <div>
                <Tooltip title='追加' placement='bottom' enterDelay={300}>
                  <Button className={classes.inlineAdd} onClick={this.handleInlineAdd(formset.name, formset.schema)}>
                    <AddIcon />
                  </Button>
                </Tooltip>
              </div>
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
