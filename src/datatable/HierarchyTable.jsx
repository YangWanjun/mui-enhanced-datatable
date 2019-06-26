import React from "react";
import uuid from 'uuid';
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Table,
  TableRow,
  TableBody,
} from "@material-ui/core";
// core components
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import tableStyle from "../assets/css/datatable";
import { common, constant, table } from "../utils";

const indent = 8;

class MyHierarchyTable extends React.Component {
  tableId = uuid();

  constructor(props) {
    super(props);

    this.state = {
      tableData: table.initTableData(props.tableData),
      showFixedHeader: false,
    }
  }

  getAllRows() {
    const { relatedName } = this.props;
    const { tableData } = this.state;
    const rootRows = common.isEmpty(tableData) ? [] : tableData.filter(row => row[relatedName] === null);
    let rows = [];
    rootRows.map(row => {
      return this.getChildRows(rows, row);
    });
    return rows;
  }

  getChildRows(items, item, deep=0) {
    const { relatedName, pk } = this.props;
    const { tableData } = this.state;
    const children = tableData.filter(sub => sub[relatedName] === item[pk]);

    items.push(this.getTableRow(item, deep));
    children.map(sub => {
      return this.getChildRows(items, sub, deep + 1);
    });
  }

  getTableRow(row, deep) {
    const { classes, tableHead, rowActions, actionsTrigger } = this.props;

    return (
      <TableRow
        key={row.__index__}
        hover
      >
        {tableHead.map((col, key) => {
          let paddingLeft = key === 0 ? ((deep * 30) || indent) : indent;
          return (
            <DataTableCell
              key={key}
              classes={classes}
              column={col}
              data={row}
              style={{paddingLeft: paddingLeft}}
            />
          );
        })}
        {rowActions.length > 0 ? (
          <DataTableCell
            classes={classes}
            actions={rowActions}
            actionsTrigger={actionsTrigger}
            data={row}
            ref={(cell) => {
              this._handleHideActions = cell && cell.getWrappedInstance().handleHideActions;
            }}
          />
        ) : null}
      </TableRow>
    );
  }

  render () {
    const { classes, tableHeaderColor, tableHead, tableActions, rowActions, tableProps } = this.props;
    const { showFixedHeader, fixedHeaderPosition, fixedHeaderColsWidth } = this.state;
    const rows = this.getAllRows()

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table} id={this.tableId} {...tableProps}>
          <DataTableHead
            {...{classes, tableHeaderColor, tableHead}}
            actions={tableActions ? tableActions : (rowActions ? true : false)}
          />
          <TableBody>
            {rows.map(row => {
              return row;
            })}
          </TableBody>
        </Table>
        { showFixedHeader ? (
          <DataTableFixedHead
            classes={classes}
            fixedHeaderPosition={fixedHeaderPosition}
            children={
              <DataTableHead
                {...{classes, tableHeaderColor, tableHead}}
                colsWidth={fixedHeaderColsWidth} 
                actions={tableActions ? tableActions : (rowActions ? true : false)}
              />
            }
          />
        ) : null}
      </div>
    );
  }
}

MyHierarchyTable.propTypes = {
  ...constant.tableProps,
  ...constant.tableActionProps,
  selectable: PropTypes.oneOf(['none', 'single']),
  relatedName: PropTypes.string,
  pk: PropTypes.string,
};

MyHierarchyTable.defaultProps = {
  ...constant.tablePropsDefault,
  ...constant.tableActionPropsDefault,
  selectable: 'none',
  relatedName: 'parent',
  pk: 'id',
};

const HierarchyTable = withStyles(tableStyle)(MyHierarchyTable)
export { HierarchyTable } ;
