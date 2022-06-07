import React from 'react';
import PropTypes from "prop-types";
import {
  TableRow,
  TableCell,
} from "@material-ui/core";
import { common, table } from '../utils';

class AggregateFooter extends React.Component {
  data = {}

  getAggregateValue = (column) => {
    const { tableData } = this.props;
    const { aggregate, name } = column;

    if (aggregate === 'sum') {
      const total = tableData.reduce((sum, row) => {
        return sum + (isNaN(parseFloat(row[name])) ? 0 : row[name] || 0);
      }, 0);
      this.data[name] = total;
      return common.toNumComma(total);
    } else if (typeof aggregate === 'function') {
      return common.getColumnDisplay(aggregate(this.data), column);
    } else {
      return 0;
    }
  };

  render() {
    const { classes, tableHead, selectable } = this.props;
    let chkCell = null;
    if (selectable !== 'none') {
      chkCell = (
        <TableCell padding="none" />
      );
    }

    if (tableHead === undefined) {
      return null;
    } else {
      return (
        <TableRow
          className={classes.tableRow}
        >
          {chkCell}
          {tableHead.map((col, key) => {
            if (col.aggregate) {
              return (
                <TableCell
                  key={key}
                  className={classes.tableCell}
                  align={table.getCellAlignment(col.type).align}
                >
                  {this.getAggregateValue(col)}
                </TableCell>
              );
            } else if (col.visible !== false) {
              return (<TableCell key={key} />)
            } else {
              return null;
            }
          })}
        </TableRow>
      );
    }
  }
}

AggregateFooter.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.object),
  selectable: PropTypes.oneOf(['none', 'single', 'multiple']),
};

AggregateFooter.defaultProps = {
  tableHead: [],
  tableData: [],
  selectable: 'none',
};

export default AggregateFooter;
