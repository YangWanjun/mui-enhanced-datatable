import React from 'react';
import PropTypes from "prop-types";
import {
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  TableSortLabel,
  Checkbox,
} from "@material-ui/core";
import { table } from '../utils';

function DataTableHead(props) {
  const {
    classes, tableHeaderColor, tableHead, sortable, onSort, order, orderBy, selected, selectable, data,
    onSelectAllClick,
  } = props;

  const createSortHandler = (property, isNumeric) => event => {
    if (sortable === true && onSort) {
      onSort(event, property, isNumeric);
    }
  };

  const numSelected = selected ? selected.length : 0;
  const rowCount = data ? data.length : 0;
  let chkCell = <React.Fragment/>;
  if (selectable === 'multiple') {
    chkCell = (
      <TableCell padding="none" className={classes.tableCellCheckable}>
        <Checkbox
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={numSelected === rowCount}
          onChange={onSelectAllClick}
          disabled={rowCount === 0}
        />
      </TableCell>
    );
  } else if (selectable === 'single') {
    chkCell = (
      <TableCell padding="none" className={classes.tableCellCheckable}></TableCell>
    );
  }

  if (tableHead === undefined) {
    return null;
  } else {
    return (
      <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
        <TableRow>
          { chkCell }
          {tableHead.filter(col => col.visible !== false).map((column, key) => {
            const { align, numeric } = table.getCellAlignment(column.type);
            return (
              <TableCell
                className={classes.tableCell + " " + classes.tableHeadCell}
                key={key}
                align={align}
                sortDirection={orderBy === column.name ? order : false}
              >
                {sortable === true && column.sortable === true ? (
                  <Tooltip
                    title="Sort"
                    placement={numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === (column.sort_field || column.name)}
                      direction={order}
                      onClick={createSortHandler((column.sort_field || column.name), numeric)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </Tooltip>
                ) : column.label}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  }
}

DataTableHead.propTypes = {
  classes: PropTypes.object,
  tableHead: PropTypes.array,
  data: PropTypes.array,
  selectable: PropTypes.string,
  selected: PropTypes.array,
  sortable: PropTypes.bool,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  tableHeaderColor: PropTypes.string,
  onSelectAllClick: PropTypes.func,
  onSort: PropTypes.func,
};

DataTableHead.defaultProps = {
  sortable: true,
};

export default DataTableHead;
