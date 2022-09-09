import React from 'react';
import PropTypes from "prop-types";
import {
  MenuItem,
  InputLabel,
  Select,
  makeStyles,
} from '@material-ui/core';
import { common } from '../utils';

const userStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  parentItem: {
    fontWeight: 'bold',
  }
}));

function HierarchySelect(props) {
  const { choices, native, name, value, label, handleChange } = props;
  const classes = userStyles();

  const getAllItems = () => {
    const rootItems = common.isEmpty(choices) ? [] : choices.filter(item => item.parent === null);
    let items = [];
    rootItems.map(item => {
      return getChildItems(items, item);
    });
    return items;
  };

  const getChildItems = (items, item, deep = 0) => {
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
      return getChildItems(items, sub, deep + 1);
    });
  }

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
        {getAllItems().map(item => {
          return item;
        })}
      </Select>
    </React.Fragment>
  );
}

HierarchySelect.propTypes = {
  label: PropTypes.object,
  name: PropTypes.string,
  value: PropTypes.any,
  choices: PropTypes.array,
  native: PropTypes.bool,
  handleChange: PropTypes.func,
};

export default HierarchySelect;
