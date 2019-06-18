import React from "react";
import {
  withStyles,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import { common } from './common'; 

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

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
    const { classes, column, value } = this.props;

    if (column.type === 'boolean') {
      // チェックボックスを表示
      return (
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
          <Select value={value.toString()} inputProps={{ name: column.name, value: value }} onChange={this.handleChange}>
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
          <Select value={value} inputProps={{ name: column.name, value: value }} onChange={this.handleChange}>
            <MenuItem value=""><em>None</em></MenuItem>
            {column.choices.map(item => {
              return (<MenuItem key={item.value} value={item.value}>{item.display_name}</MenuItem>);
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

export default withStyles(styles)(ControlCreator);
