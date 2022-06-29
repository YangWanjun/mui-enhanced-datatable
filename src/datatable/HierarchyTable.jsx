import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import PropTypes from "prop-types";
// @material-ui/core components
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
  makeStyles,
} from "@material-ui/core";
// core components
import { useIsWidthDown } from "../components";
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import DataTableFixedHead from './DataTableFixedHead';
import DataTableToolbar from "./DataTableToolbar";
import tableStyle from "../assets/css/datatable";
import { common, constant, table } from "../utils";

const indent = 8;
const tableId = uuidv4();
const toolbarId = uuidv4();
const fixedTableId = uuidv4();
const fixedHeaderId = uuidv4();
const useStyles = makeStyles(tableStyle);

function HierarchyTable(props) {
  const { 
    tableHead, selectable, pushpinTop, relatedName, pk, title,
    tableHeaderColor, tableActions, rowActions, tableProps, allowCsv, tableStyles
  } = props;
  const [ tableData, setTableData ] = useState([]);
  const [ selected, setSelected ] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setTableData(table.initTableData(props.tableData));
  }, [props.tableData]);

  useEffect(() => {
    window.addEventListener('scroll', handleFixedHeader);
    window.addEventListener('resize', handleFixedHeader);
    return () => {
      window.removeEventListener('scroll', handleFixedHeader);
      window.removeEventListener('resize', handleFixedHeader);  
    };
  }, []);

  useEffect(() => {
    handleFixedHeader();
  });

  const handleFixedHeader = () => {
    common.setFixedTableHeader(fixedHeaderId, toolbarId, tableId, fixedTableId, pushpinTop);
  };

  const getAllRows = () => {
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
      return getChildRows(rows, row);
    });
    return rows;
  }

  const getChildRows = (items, item, deep=0) => {
    const children = tableData.filter(sub => sub[relatedName] === item[pk]);

    items.push(getTableRow(item, deep));
    children.map(sub => {
      return getChildRows(items, sub, deep + 1);
    });
  }

  const getTableRow = (row, deep) => {
    const is_selected = table.isSelected(row, selected);

    return (
      <TableRow
        key={row.__index__}
        hover
      >
        { selectable === 'single' ? (
          <TableCell padding="none">
            <Checkbox checked={is_selected} onClick={() => (
              setSelected(table.onRowSelect(row, selectable, selected).selected
            ))} />
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

  const rows = getAllRows();
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
          id={toolbarId}
          {...toolbarProps}
        />
      ) : null}
      <div style={{width: 'auto', overflowX: "auto"}}>
      <Table className={classes.table} id={tableId} {...tableProps} style={{...tableStyles}}>
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
      {!useIsWidthDown('xs') ? (
        <DataTableFixedHead
          id={fixedHeaderId}
          tableId={fixedTableId}
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

export default HierarchyTable;
