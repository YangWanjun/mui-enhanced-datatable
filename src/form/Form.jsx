import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Grid,
} from '@material-ui/core';
import ControlCreateor from './ControlCreator';
import { common, constant } from '../utils';

const styles = () => ({
  error: {
    color: 'red',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
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

  handleChange(name, value, type) {
    this.setState((state) => {
      let data = state.data;
      data[name] = value;
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

  validate = () => {
    const { data } = this.state;
    let valid = true;
    let errors = {};
    // 必須項目チェック
    this.props.schema.map(col => {
      const value = data[col.name];
      if (col.required === true) {
        if (value === null || value === '' || value === undefined || (typeof value === 'object' && common.isEmpty(value))) {
          valid = false;
          this.pushError(col.name, common.formatStr(constant.ERROR.REQUIRE_FIELD, {name: col.label}), errors);
        }
      }
      return true;
    });
    // カスタマイズのチェック
    this.props.checkList.map(method => {
      const retVal = method(data);
      if (retVal !== true) {
        valid = false;
        retVal.map(item => (
          this.pushError(item.name, item.message, errors)
        ));
      }
      return true;
    });

    this.setState({errors});
    return valid;
  };

  pushError = (name, error, errors) => {
    if (name in errors) {
      errors[name].push(error);
    } else {
      errors[name] = [error];
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

  handleOk = () => {
    const formData = this.clean();
    return formData;
  };

  createFormLayout(data, schema, layout) {
    let control = null;
    if (common.isEmpty(layout)) {
      control = (
        <Grid container>
          {schema.map((col, key) => (
            this.createFormField(col, key, 12, data)
          ))}
        </Grid>
      );
    } else {
      control = (
        <Grid container>
          {layout.map((row, key) => (
            this.createRowLayout(row, key, data)
          ))}
        </Grid>
      );
    }
    return control;
  }

  createRowLayout(row, key, data) {
    const { schema } = this.props;
    if (typeof row === 'string') {
      const col = common.getFromList(schema, 'name', row);
      return col ? this.createFormField(col, row, 12, data) : null;
    } else if (Array.isArray(row)) {
      const colSpan = Math.floor(12 / row.length);
      return (
        <React.Fragment key={key}>
          {row.map((fieldName, key) => {
            const col = common.getFromList(schema, 'name', fieldName);
            return col ? this.createFormField(col, key, colSpan, data) : null;
          })}
        </React.Fragment>
      );
    }
    return null;
  }

  createFormField(col, key, colSpan, data) {
    const { classes } = this.props;
    const errors = this.state.errors[col.name];
    if (col.read_only === true) {
      return (
        <Grid item key={key} xs={12} sm={12} md={colSpan}>
          <FormControl className={classes.formControl}>
            <TextField
              disabled
              value={data[col.name]}
              label={col.label}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
        </Grid>  
      );
    } else if (col.type === 'cascade') {
      return (
        <ControlCreateor
          key={key}
          column={col}
          data={data}
          handleChange={this.handleChange}
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
            handleChange={this.handleChange}
          />
        </Grid>
      );
    }
  }

  render() {
    const { classes, schema, layout } = this.props;
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
        {this.createFormLayout(data, schema, layout)}
      </div>
    );
  }

}

MyForm.propTypes = {
  schema: PropTypes.arrayOf(PropTypes.object).isRequired,
  layout: PropTypes.array,
  data: PropTypes.object,
  onChanges: PropTypes.arrayOf(PropTypes.func),
  checkList: PropTypes.arrayOf(PropTypes.func),
  errors: PropTypes.object,
};

MyForm.defaultProps = {
  layout: [],
  data: {},
  onChanges: [],
  checkList: [],
};

const Form = withStyles(styles)(MyForm);
export {Form};
