import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
} from '@material-ui/core';
import ControlCreateor from './ControlCreator';
import {common} from '../utils';

class Form extends React.Component {

  constructor(props) {
    super(props);

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

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;

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
    const { errors } = this.state;
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
      const message = errors[col.name] || null;
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
            message={message}
            handleChange={this.handleChange}
            // handleFieldChange={this.handleFieldChange}
            // handleCheck={this.handleCheck}
          />
        </Grid>
      );
    }
  }

  render() {
    const { schema, layout } = this.props;
    const { data } = this.state;
    return this.createFormLayout(data, schema, layout);
  }

}

Form.propTypes = {
  schema: PropTypes.arrayOf(PropTypes.object).isRequired,
  layout: PropTypes.array,
  data: PropTypes.object,
};

Form.defaultProps = {
  layout: [],
  data: {},
};

export {Form};
