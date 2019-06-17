import React from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import DataTableCell from './DataTableCell';

class DataTableHead extends React.Component {

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
    const { classes, tableHeaderColor, tableHead, colsWidth } = this.props;
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
              if (column.type === 'integer' || column.type === 'decimal') {
                align = 'right';
              } else if (column.type === 'boolean') {
                align = 'center';
              }
              return (
                <TableCell
                  className={classes.tableCell + " " + classes.tableHeadCell}
                  key={key}
                  style={{width}}
                  align={align}
                >
                  {column.label}
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

export default DataTableHead;
