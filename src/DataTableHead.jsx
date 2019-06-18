import React from 'react';
import PropTypes from "prop-types";
import {
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  TableSortLabel,
} from "@material-ui/core";
import DataTableCell from './DataTableCell';

class DataTableHead extends React.Component {

  createSortHandler = (property, isNumeric) => event => {
    if (this.props.sortable === true && this.props.onSort) {
      this.props.onSort(event, property, isNumeric);
    }
  };

  getActions() {
    const { actions } = this.props;
    if (!actions) {
      return null;
    } else if (Array.isArray(actions) && actions.length > 0) {
      return (
        <DataTableCell {...this.props}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    const { classes, tableHeaderColor, tableHead, colsWidth, sortable, order, orderBy } = this.props;
    const actionCell = this.getActions();

    if (tableHead === undefined) {
      return null;
    } else {
      return (
        <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
          <TableRow>
            {tableHead.map((column, key) => {
              let width = 'inherit';
              if (column.visible !== false && colsWidth && colsWidth.length >= key) {
                width = colsWidth[key];
                key += 1;
              }
              let align = 'left';
              let numeric = false;
              if (column.type === 'integer' || column.type === 'decimal') {
                align = 'right';
                numeric = true;
              } else if (column.type === 'boolean') {
                align = 'center';
              }
              return (
                <TableCell
                  className={classes.tableCell + " " + classes.tableHeadCell}
                  key={key}
                  style={{width}}
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
                        onClick={this.createSortHandler((column.sort_field || column.name), numeric)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </Tooltip>
                  ) : column.label}
                </TableCell>
              );
            })}
            {actionCell}
          </TableRow>
        </TableHead>
      );
    }
  }
}

DataTableHead.propTypes = {
  sortable: PropTypes.bool,
};

DataTableHead.defaultProps = {
  sortable: true,
};

export default DataTableHead;
