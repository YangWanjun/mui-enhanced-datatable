import React from "react";
import { v4 as uuidv4 } from 'uuid';
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
  withWidth,
  isWidthDown,
} from "@material-ui/core";
// core components
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import DataTableFixedHead from './DataTableFixedHead';
import DataTableToolbar from "./DataTableToolbar";
import tableStyle from "../assets/css/datatable";
import { common, constant, table } from "../utils";

const indent = 8;

class HierarchyTable extends React.Component {
  tableId = uuidv4();
  toolbarId = uuidv4();
  fixedTableId = uuidv4();
  fixedHeaderId = uuidv4();

  constructor(props) {
    super(props);

    this.state = {
      tableData: table.initTableData(props.tableData),
      selected: [],
    }
  }

  handleFixedHeader = () => {
    let { pushpinTop, width } = this.props;
    if (!isWidthDown('xs', width)) {
      common.setFixedTableHeader(this.fixedHeaderId, this.toolbarId, this.tableId, this.fixedTableId, pushpinTop);
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleFixedHeader);
    window.addEventListener('resize', this.handleFixedHeader);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleFixedHeader);
    window.removeEventListener('resize', this.handleFixedHeader);
  }

  componentDidUpdate() {
    this.handleFixedHeader();
  }

  getAllRows() {
    const { relatedName } = this.props;
    const { tableData } = this.state;
    let rootRows = common.isEmpty(tableData) ? [] : tableData.filter(row => row[relatedName] === null);
    if (tableData.length > 0 && 'id' in tableData[0]) {
      // 親が見つからないデータもトップに表示する。
      const ids = tableData.map(i => i.id);
      rootRows = rootRows.concat(tableData.filter(row => {
        return row[relatedName] && ids.indexOf(row[relatedName]) < 0;
      }));
    }
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
    const { classes, tableHead, selectable } = this.props;
    const { selected } = this.state;
    const is_selected = table.isSelected(row, selected);

    return (
      <TableRow
        key={row.__index__}
        hover
      >
        { selectable === 'single' ? (
          <TableCell padding="none">
            <Checkbox checked={is_selected} onClick={() => this.setState(table.onRowSelect(row, selectable, selected))} />
          </TableCell>
        ) : null }
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
      </TableRow>
    );
  }

  render () {
    const { 
      classes, title, tableHeaderColor, tableHead, tableData, tableActions, rowActions, tableProps, allowCsv, pk, selectable, width, tableStyles,
    } = this.props;
    const { selected } = this.state;
    const rows = this.getAllRows();
    const toolbar = tableActions ? true : (rowActions ? true : false);

    const headerProps = {
      classes: classes,
      tableHeaderColor: tableHeaderColor,
      tableHead: tableHead,
      actions: tableActions ? tableActions : (rowActions ? true : false),
      selectable: selectable,
    };
    const toolbarProps = {
      title: title,
      tableHead: tableHead,
      tableData: tableData,
      tableActions: tableActions,
      rowActions: rowActions,
      allowCsv: allowCsv,
      selected: selected,
      pk: pk,
    }

    return (
      <div className={classes.tableResponsive}>
        {toolbar ? (
          <DataTableToolbar
            id={this.toolbarId}
            {...toolbarProps}
          />
        ) : null}
        <div style={{width: 'auto', overflowX: "auto"}}>
        <Table className={classes.table} id={this.tableId} {...tableProps} style={{...tableStyles}}>
          <DataTableHead
            {...headerProps}
          />
          <TableBody>
            {rows.length > 0 ? (
              rows.map(row => {
                return row;
              })
            ) : (
              <TableRow
                className={classes.tableRow}
              >
                <TableCell colSpan={tableHead.length + (selectable === 'none' ? 0 : 1)}>
                  {constant.INFO.NO_DATA}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
        {!isWidthDown('xs', width) ? (
          <DataTableFixedHead
            id={this.fixedHeaderId}
            tableId={this.fixedTableId}
            classes={classes}
            tableHeader={
              <DataTableHead
                {...headerProps}
              />
            }
            toolbar={
              toolbar ? (
                <DataTableToolbar
                  {...toolbarProps}
                />
              ) : null
            }
          />
        ) : null }
      </div>
    );
  }
}

HierarchyTable.propTypes = {
  ...constant.tableProps,
  ...constant.tableActionProps,
  title: PropTypes.string,
  selectable: PropTypes.oneOf(['none', 'single']),
  relatedName: PropTypes.string,
  pk: PropTypes.string,
  pushpinTop: PropTypes.number,
};

HierarchyTable.defaultProps = {
  ...constant.tablePropsDefault,
  ...constant.tableActionPropsDefault,
  selectable: 'none',
  relatedName: 'parent',
  pk: 'id',
  pushpinTop: 0,
};

export default withStyles(tableStyle)(withWidth()(HierarchyTable))
