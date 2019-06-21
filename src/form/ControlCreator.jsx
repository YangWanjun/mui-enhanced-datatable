import React from "react";
import {
  withStyles,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import formStyle from "../assets/css/form";
import { common } from '../utils/common'; 

class ControlCreator extends React.Component {

  handleChange = (event) => {
    if (this.props.handleChange) {
      this.props.handleChange(
        event.target.name,
        event.target.value,
        this.props.column.type,
      );
    }
  };

  render() {
    const { classes, column } = this.props;
    let value = this.props.value === undefined ? null : this.props.value;

    if (column.type === 'boolean') {
      // チェックボックスを表示
      return (
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
          <Select
            value={(value === null || value === undefined) ? '' : value.toString()}
            inputProps={{ name: column.name, value: value }}
            onChange={this.handleChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem key='true' value='true'>はい</MenuItem>
              <MenuItem key='false' value='false'>いいえ</MenuItem>
          </Select>
        </FormControl>
      );
    } else if (column.choices && !common.isEmpty(column.choices)) {
      // 選択肢が存在する場合
      return (
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
          <Select
            value={value}
            inputProps={{ name: column.name, value: value }}
            onChange={this.handleChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {column.choices.map(item => {
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
        </FormControl>
      );
    } else {
      return (
        <FormControl className={classes.formControl}>
          <TextField 
            name={column.name}
            label={column.label}
            value={value}
            onChange={this.handleChange}
          />
        </FormControl>
      );
    }
  }
}

export default withStyles(formStyle)(ControlCreator);
