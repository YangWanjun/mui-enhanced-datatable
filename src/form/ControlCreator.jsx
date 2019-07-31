import React from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  TextField,
  Select,
  Checkbox,
  MenuItem,
} from "@material-ui/core";
import formStyle from "../assets/css/form";
import HierarchySelect from './HierarchySelect';
import { common } from "../utils";

class ControlCreator extends React.Component {

  handleChange = (event) => {
    let { name, value } = event.target;
    const { type, variant } = this.props.column;
    if (type === 'boolean') {
      if (variant !== 'select') {
        // チェックボックスの場合
        name = event.target.value;
        value = event.target.checked;
      } else {
        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }
      }
    } else if (type === 'integer') {
      value = common.toInteger(value);
    }

    if (this.props.handleChange) {
      this.props.handleChange(name, value, type)(event);
    }
  };

  handleBlur = (name) => (event) => {
    if (this.props.handleBlur) {
      this.props.handleBlur(event, name);
    }
  }

  render() {
    const { classes, column, errors, placeholder } = this.props;
    let control = null;
    let { value } = this.props;
    let label = column.label + (column.required === true ? '（*）' : '');
    value = (value === null || value === undefined) ? '' : value;
    const error = Array.isArray(errors) && errors.length > 0;
    const errorNodes = (
      error === true ? (
        <React.Fragment>
          {errors.map((message, key) => <FormHelperText key={key}>{message}</FormHelperText>)}
        </React.Fragment>
      ) : null
    );
    let placeholderProps = null;
    if (placeholder) {
      placeholderProps = {
        placeholder: placeholder,
        InputLabelProps: { shrink: true,},
      };
    }

    if (column.read_only === true) {
      control = (
        <TextField
          disabled
          error={error}
          name={column.name}
          value={value}
          label={label}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    } else if (column.type === 'boolean') {
      // チェックボックスを表示
      control = (
        <React.Fragment>
          { column.variant === 'select' ? (
            <React.Fragment>
              <InputLabel htmlFor={column.name}>{label}</InputLabel>
              <Select
                value={value.toString()}
                inputProps={{ name: column.name, value: value }}
                onChange={this.handleChange}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem key='true' value='true'>はい</MenuItem>
                  <MenuItem key='false' value='false'>いいえ</MenuItem>
              </Select>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value = value === true ? true : false} 
                    value={column.name} 
                    onChange={this.handleChange}
                  />
                }
                label={label}
              />
            </React.Fragment>
          ) }
        </React.Fragment>
      );
    } else if (column.type === 'choice') {
      // 選択肢が存在する場合
      const choices = column.choices || [];
      if (!common.isEmpty(column.choices) && column.choices[0].hasOwnProperty('parent')) {
        control = (
          <HierarchySelect
            name={column.name}
            label={label}
            value={value}
            error={error}
            choices={choices}
            handleChange={this.handleChange}
          />
        );
      } else {
        control = (
          <React.Fragment>
            <InputLabel htmlFor={column.name}>{label}</InputLabel>
            <Select
              value={value}
              inputProps={{ name: column.name, value: value }}
              onChange={this.handleChange}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {choices.map(item => {
                return (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                  >
                    {item.display_name}
                  </MenuItem>
                );
              })}
            </Select>
          </React.Fragment>
        );
      }
    } else if (column.type === 'date') {
      control = (
        <TextField
          error={error}
          name={column.name}
          value={value}
          label={label}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={this.handleChange}
        />
      );
    } else if (column.type === 'text') {
      control = (
        <TextField
          error={error}
          multiline
          name={column.name}
          value={value}
          label={label}
          {...placeholderProps}
          onChange={this.handleChange}
        />
      );
    } else {
      control = (
        <TextField 
          error={error}
          name={column.name}
          label={label}
          value={value}
          {...placeholderProps}
          inputProps={{maxLength: column.max_length}}
          onChange={this.handleChange}
          onBlur={this.handleBlur(column.name)}
        />
      );
    }

    return (
      <FormControl className={classes.formControl} error={error}>
        {control}
        {errorNodes}
      </FormControl>
    );
  }
}

ControlCreator.propTypes = {
  classes: PropTypes.object.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
};

ControlCreator.defaultProps = {
  errors: [],
};

export default withStyles(formStyle)(ControlCreator);
