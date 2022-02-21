import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from "prop-types";
// @mui/material components
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
  TableFooter,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
// core components
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import DataTablePagination from './DataTablePagination';
import DataTableToolbar from "./DataTableToolbar";
import DataTableFixedHead from "./DataTableFixedHead";
import tableStyle from "../assets/css/datatable";
import { common, constant, table } from "../utils";
import AggregateFooter from "./AggregateFooter";
import { useIsWidthDown } from "../hooks";

const useStyles = makeStyles(tableStyle);

const tableId = uuidv4();
const toolbarId = uuidv4();
const fixedTableId = uuidv4();
const fixedHeaderId = uuidv4();

const EnhancedTable = (props) => {

  const [tableData, setTableData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [orderNumeric, setOrderNumeric] = useState(false);
  const [filters, setFilters] = useState({});
  const location = useLocation();
  const history = useHistory();
  const isXsDown = useIsWidthDown('sm');

  // 初期化設定
  useEffect(() => {
    setTableData(table.initTableData(props.tableData));
    const json = common.urlToJson(location.search);
    const order = table.getOrder(location);
    if (order) {
      setOrder(order.__order);
      setOrderBy(order.__orderBy);
      setOrderNumeric(order.__orderNumeric);
    }
    if (json.__rowsPerPage) {
      setRowsPerPage(common.toInteger(json.__rowsPerPage));
    }
    if (json.__page) {
      setPage(common.toInteger(json.__page));
    }
    // フィルター項目
    const urlFilters = table.loadFilters(location, props.tableHead);
    const storageFilter = getFilter();
    if (!common.isEmpty(storageFilter)) {
      setFilters(storageFilter);
    } else if (!common.isEmpty(urlFilters)) {
      setFilters(urlFilters);
    }
  }, []);

  const handleFixedHeader = () => {
    const { pushpinTop } = props;
    common.setFixedTableHeader(fixedHeaderId, toolbarId, tableId, fixedTableId, pushpinTop);
  };

  // ヘッダーを固定するイベント
  useEffect(() => {
    if (!isXsDown) {
      window.addEventListener('scroll', handleFixedHeader);
      window.addEventListener('resize', handleFixedHeader);
      return () => {
        window.removeEventListener('scroll', handleFixedHeader);
        window.removeEventListener('resize', handleFixedHeader);  
      }
    }
  }, []);

  useEffect(() => {
    if (!isXsDown) {
      handleFixedHeader();
    }
  });

  // function UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (JSON.stringify(this.props.tableData) !== JSON.stringify(nextProps.tableData)) {
  //     const { selected } = this.state;
  //     const tableData = table.initTableData(nextProps.tableData);
  //     this.setState({tableData});
  //     if (!common.isEmpty(selected)) {
  //       // テーブルのデータ変更したら、選択したデータも変更する。
  //       let pkList = [];
  //       let key = null;
  //       for (let data of selected) {
  //         if (!key) {
  //           key = this.getDataKey(data);
  //         }
  //         pkList.push(data[key]);
  //       }
  //       const newSelected = tableData.filter(row => pkList.indexOf(row[key]) >= 0);
  //       this.setState({ selected: newSelected });
  //     }
  //   }
  // }

  const handleChangePage = (event, page) => {
    handleFixedHeader();
    setPage(page);
    const { urlReflect } = props;
    if (urlReflect === true) {
      table.changePaginationUrl(page, location, history);
    }
  };

  const handleChangeRowsPerPage = event => {
    handleFixedHeader();
    if (props.server) {
    } else {
      setRowsPerPage(event.target.value);
    }
    // 1ページ目に移動
    handleChangePage(event, 0);
    const { urlReflect } = props;
    if (urlReflect === true) {
      table.changePageSizeUrl(event.target.value, location, history);
    }
  };

  const handleSort = (event, property, _orderNumeric) => {
    const _orderBy = property;
    let _order = 'desc';

    if (orderBy === property && order === 'desc') {
      _order = 'asc';
    }
    handleFixedHeader();
    setOrder(_order);
    setOrderBy(_orderBy);
    setOrderNumeric(_orderNumeric);
    const { urlReflect } = props;
    if (urlReflect === true) {
      table.changeOrderUrl(_order, _orderBy, _orderNumeric, location, history);
    }
  };

  const handleChangeFilter = (event, _filters) => {
    const { tableHead } = props;
    handleFixedHeader();
    filters = table.resetFilter(_filters, tableHead);
    setFilters(_filters);
    saveFilter(_filters);
    // 1ページ目に移動
    handleChangePage(event, 0);
    const { urlReflect } = props;
    if (urlReflect === true) {
      table.changeFilterUrl(_filters, location, history);
    }
  };

  /**
   * 絞り込み条件を保存する。
   * 他画面に遷移してまた戻る時に、入力した検索条件を維持するため。
   */
  const saveFilter = (filters) => {
    const { storageKey } = props;
    if (storageKey) {
      localStorage.setItem(`${location.pathname}-key-${storageKey}`, JSON.stringify(filters));
    }
  };

  /**
   * 絞り込み条件を取得する。
   * 他画面に遷移してまた戻る時に、入力した検索条件を維持するため。
   */
  const getFilter = () => {
    const { storageKey } = props;
    if (storageKey) {
      const data = localStorage.getItem(`${location.pathname}-key-${storageKey}`);
      return JSON.parse(data);
    } else {
      return {};
    }
  }

  const isSelected = (data) => {
    if (!data) {
      return false;
    }
    let key = getDataKey(data);

    if (!selected) {
      return false;
    } else {
      return selected.filter(row => row[key] === data[key]).length > 0;
    }
  };

  const getDataKey = (data) => {
    const { pk } = props;
    let key = null;
    if (data.__index__ !== null && data.__index__ !== undefined) {
      key = '__index__';
    } else {
      key = pk;
    }
    return key;
  }

  const handleRowSelect = (data) => {
    const { selectable } = props;
    if (selectable === 'none') {
      return;
    }
    const _isSelected = isSelected(data);
    let newSelected = [];
    if (selectable === 'multiple') {
      if (_isSelected === true) {
        const selectedIndex = selected.indexOf(data);
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      } else {
        newSelected = newSelected.concat(selected, data);
      }
    } else if (selectable === 'single') {
      if (_isSelected === true) {
        newSelected = [];
      } else {
        newSelected = [data];
      }
    }

    setSelected(newSelected);
  };

  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      const results = common.stableFilter(tableData, filters);
      setSelected(results);
      return;
    } else {
      clearSelected();
    }
  };

  const clearSelected = () => {
    setSelected([]);
  };

  const handleSaveCallback = (data) => {
    if (Array.isArray(selected) && selected.length === 1) {
      // 変更成功の場合、変更後のデータをテーブルに更新する
      setSelected([data]);
    }
  };

  const classes = useStyles();
  const {
    tableHead, tableActions, rowActions, toolbar, selectable, allowCsv, pk, showTitle, showAggregate,
    addProps, editProps, deleteProps, filterLayout, tableStyles,
  } = props;
  let results = common.stableSort(tableData, common.getSorting(order, orderBy, orderNumeric));
  if (!common.isEmpty(filters)) {
    results = common.stableFilter(results, filters);
  }
  const headerProps = {
    classes: classes,
    tableHeaderColor: props.tableHeaderColor,
    tableHead: tableHead,
    onSort: handleSort,
    order: order,
    orderBy: orderBy,
    selectable: selectable,
    selected: selected,
    data: results,
    onSelectAllClick: handleSelectAllClick,
  };
  const toolbarProps = {
    title: props.title,
    showTitle: showTitle,
    filters: filters,
    filterLayout: filterLayout,
    tableHead: tableHead,
    tableData: results,
    selected: selected,
    onChangeFilter: handleChangeFilter,
    tableActions: tableActions,
    rowActions: rowActions,
    allowCsv: allowCsv,
    pk: pk,
    addProps: addProps,
    editProps: editProps,
    saveCallback: handleSaveCallback,
    deleteProps: deleteProps,
    clearSelected: clearSelected,
  };

  return (
    <div className={classes.tableResponsive}>
      {toolbar ? (
        <DataTableToolbar
          id={toolbarId}
          {...toolbarProps}
        />
      ) : null}
      <div style={{width: 'auto', overflowX: "auto"}} onScroll={handleFixedHeader}>
      <Table className={classes.table} id={tableId} {...props.tableProps} style={{...tableStyles}}>
        <DataTableHead
          {...headerProps}
        />
        <TableBody>
          {results.length > 0 ? (
            common.getDataForDisplay(results, rowsPerPage, page)
            .map((row, key) => {
              const rowStyles = common.getExtraRowStyles(row, tableHead);
              const _isSelected = isSelected(row);
              let chkCell = null;
              if (selectable === 'multiple' || selectable === 'single') {
                chkCell = (
                  <TableCell padding="none">
                    <Checkbox checked={_isSelected} onClick={() => handleRowSelect(row)} />
                  </TableCell>
                );
              }
              return (
                <TableRow
                  key={key}
                  className={classes.tableRow}
                  role="checkbox"
                  aria-checked={_isSelected}
                  selected={_isSelected}
                  style={{...rowStyles}}
                >
                  {chkCell}
                  {tableHead.map((col, key) => {
                    return (
                      <DataTableCell
                        key={key}
                        classes={classes}
                        column={col}
                        data={row}
                      />
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow
              className={classes.tableRow}
            >
              <TableCell colSpan={tableHead.length + (selectable === 'none' ? 0 : 1)}>
                {constant.INFO.NO_DATA}
              </TableCell>
            </TableRow>
          ) }
        </TableBody>
        <TableFooter>
          {results.length > 0 && showAggregate === true ? (
            <AggregateFooter
              classes={classes}
              tableHead={tableHead}
              tableData={results}
              selectable={selectable}
            />
          ) : null }
        </TableFooter>
      </Table>
      </div>
      <DataTablePagination
        component="div"
        count={results.length}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={props.rowsPerPageOptions}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {!isXsDown ? (
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

EnhancedTable.propTypes = {
  ...constant.tableProps,
  ...constant.tableActionProps,
  selectable: PropTypes.oneOf(['none', 'single', 'multiple']),
  pk: PropTypes.string,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  server: PropTypes.bool,
  toolbar: PropTypes.bool,
  filters: PropTypes.object,
  filterLayout: PropTypes.array,
  pushpinTop: PropTypes.number,
  tableActions: PropTypes.arrayOf(PropTypes.object),
  rowActions: PropTypes.arrayOf(PropTypes.object),
  allowCsv: PropTypes.bool,
  urlReflect: PropTypes.bool,
  showTitle: PropTypes.bool,
  showAggregate: PropTypes.bool,
  addProps: PropTypes.shape({
    title: PropTypes.string,
    schema: PropTypes.array.isRequired,
    handleOk: PropTypes.func.isRequired,
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  }),
  editProps: PropTypes.shape({
    title: PropTypes.string,
    schema: PropTypes.array.isRequired,
    handleOk: PropTypes.func.isRequired,
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  }),
  deleteProps: PropTypes.shape({
    handleDelete: PropTypes.func.isRequired,
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  }),
  storageKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

EnhancedTable.defaultProps = {
  ...constant.tablePropsDefault,
  ...constant.tableActionPropsDefault,
  selectable: 'none',
  pk: 'id',
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 25, 50, 100],
  server: false,
  toolbar: true,
  filters: {},
  pushpinTop: 0,
  tableActions: [],
  rowActions: [],
  allowCsv: false,
  urlReflect: false,
  showTitle: false,
  showAggregate: false,
  addProps: null,
  editProps: null,
  deleteProps: null,
};

export default EnhancedTable;
