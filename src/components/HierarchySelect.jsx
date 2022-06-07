import React from 'react';
import {
  withStyles,
  MenuItem,
  InputLabel,
  Select,
} from '@material-ui/core';
import { common } from '../utils';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  parentItem: {
    fontWeight: 'bold',
  }
});

class HierarchySelect extends React.Component {

  getAllItems() {
    const { choices } = this.props;
    const rootItems = common.isEmpty(choices) ? [] : choices.filter(item => item.parent === null);
    let items = [];
    rootItems.map(item => {
      return this.getChildItems(items, item);
    });
    return items;
  }

  getChildItems(items, item, deep = 0) {
    const { classes, choices, native } = this.props;
    const children = choices.filter(sub => sub.parent === item.value);
    let itemProps = { key: item.value + '_item', value: item.value };
    let display_name = item.display_name;
    if (children && children.length > 0) {
      itemProps['className'] = classes.parentItem;
      display_name = '▼' + display_name;
    }

    if (native === true) {
      items.push(
        <option
          disabled={item.disabled === true}
          {...itemProps}
        >
          {`${'　'.repeat(deep)}${display_name}`}
        </option>
      );
    } else {
      items.push(
        <MenuItem
          disabled={item.disabled === true}
          {...itemProps}
          style={{ marginLeft: deep * 30 }}
        >
          {display_name}
        </MenuItem>
      );
    }
    children.map(sub => {
      return this.getChildItems(items, sub, deep + 1);
    });
  }

  render() {
    const { name, value, label, native, handleChange } = this.props;
    const items = this.getAllItems();

    return (
      <React.Fragment>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Select
          native={native === true}
          value={value}
          inputProps={{ name: name, value: value }}
          onChange={handleChange}
        >
          {native === true ? <option value=""></option> : <MenuItem key='none' value=""><em>None</em></MenuItem>}
          {items.map(item => {
            return item;
          })}
        </Select>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(HierarchySelect);
