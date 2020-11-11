import React from "react";
import { withRouter } from 'react-router-dom';
import uuid from 'uuid';
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
  TableFooter,
  withWidth,
  isWidthDown,
} from "@material-ui/core";
// core components
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import DataTablePagination from './DataTablePagination';
import DataTableToolbar from "./DataTableToolbar";
import DataTableFixedHead from "./DataTableFixedHead";
import tableStyle from "../assets/css/datatable";
import { common, constant, table } from "../utils";
import AggregateFooter from "./AggregateFooter";

class MyEnhancedTable extends React.Component {
  tableId = uuid();
  toolbarId = uuid();
  fixedTableId = uuid();
  fixedHeaderId = uuid();

  constructor(props) {
    super(props);

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    this.state = {
      tableData: table.initTableData(props.tableData),
      selected: [],
      ...this.initialize(props),
    };
  }

  initialize = (props) => {
    const { location, rowsPerPage } = this.props;
    const json = common.urlToJson(location.search);
    const order = table.getOrder(location)
    let state = {
      page: 0,
      rowsPerPage: rowsPerPage,
      order: 'asc',
      orderBy: '',
      orderNumeric: false,
      filters: {},
    };
    if (order) {
      state['order'] = order.__order;
      state['orderBy'] = order.__orderBy;
      state['orderNumeric'] = order.__orderNumeric;
    }
    if (json.__rowsPerPage) {
      state['rowsPerPage'] = common.toInteger(json.__rowsPerPage);
    }
    if (json.__page) {
      state['page'] = common.toInteger(json.__page);
    }
    // フィルター項目
    const urlFilters = table.loadFilters(location, props.tableHead);
    const storageFilter = this.getFilter();
    if (!common.isEmpty(storageFilter)) {
      state['filters'] = storageFilter;
    } else if (!common.isEmpty(urlFilters)) {
      state['filters'] = urlFilters;
    }
    return state;
  };

  handleFixedHeader = () => {
    const { pushpinTop, width } = this.props;
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.tableData) !== JSON.stringify(nextProps.tableData)) {
      const { selected } = this.state;
      const tableData = table.initTableData(nextProps.tableData);
      this.setState({tableData});
      if (!common.isEmpty(selected)) {
        // テーブルのデータ変更したら、選択したデータも変更する。
        let pkList = [];
        let key = null;
        for (let data of selected) {
          if (!key) {
            key = this.getDataKey(data);
          }
          pkList.push(data[key]);
        }
        const newSelected = tableData.filter(row => pkList.indexOf(row[key]) >= 0);
        this.setState({ selected: newSelected });
      }
    }
  }

  handleChangePage = (event, page) => {
    this.handleFixedHeader();
    this.setState({page});
    const { urlReflect, location, history } = this.props;
    if (urlReflect === true) {
      table.changePaginationUrl(page, location, history);
    }
  };

  handleChangeRowsPerPage = event => {
    this.handleFixedHeader();
    if (this.props.server) {
    } else {
      this.setState({ rowsPerPage: event.target.value });
    }
    // 1ページ目に移動
    this.handleChangePage(event, 0);
    const { urlReflect, location, history } = this.props;
    if (urlReflect === true) {
      table.changePageSizeUrl(event.target.value, location, history);
    }
  };

  handleSort = (event, property, orderNumeric) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.handleFixedHeader();
    this.setState({ order, orderBy, orderNumeric });
    const { urlReflect, location, history } = this.props;
    if (urlReflect === true) {
      table.changeOrderUrl(order, orderBy, orderNumeric, location, history);
    }
  };

  handleChangeFilter = (event, filters) => {
    const { tableHead } = this.props;
    this.handleFixedHeader();
    filters = table.resetFilter(filters, tableHead);
    this.setState({ filters });
    this.saveFilter(filters);
    // 1ページ目に移動
    this.handleChangePage(event, 0);
    const { urlReflect, location, history } = this.props;
    if (urlReflect === true) {
      table.changeFilterUrl(filters, location, history);
    }
  };

  /**
   * 絞り込み条件を保存する。
   * 他画面に遷移してまた戻る時に、入力した検索条件を維持するため。
   */
  saveFilter = (filters) => {
    const { location, storageKey } = this.props;
    if (storageKey) {
      localStorage.setItem(`${location.pathname}-key-${storageKey}`, JSON.stringify(filters));
    }
  };

  /**
   * 絞り込み条件を取得する。
   * 他画面に遷移してまた戻る時に、入力した検索条件を維持するため。
   */
  getFilter = () => {
    const { location, storageKey } = this.props;
    if (storageKey) {
      const data = localStorage.getItem(`${location.pathname}-key-${storageKey}`);
      return JSON.parse(data);
    } else {
      return {};
    }
  }

  isSelected = (data) => {
    if (!data) {
      return false;
    }
    const { selected } = this.state;
    let key = this.getDataKey(data);

    if (!selected) {
      return false;
    } else {
      return selected.filter(row => row[key] === data[key]).length > 0;
    }
  };

  getDataKey = (data) => {
    const { pk } = this.props;
    let key = null;
    if (data.__index__ !== null && data.__index__ !== undefined) {
      key = '__index__';
    } else {
      key = pk;
    }
    return key;
  }

  handleRowSelect = (data) => {
    if (this.props.selectable === 'none') {
      return;
    }
    const { selected } = this.state;
    const isSelected = this.isSelected(data);
    let newSelected = [];
    if (this.props.selectable === 'multiple') {
      if (isSelected === true) {
        const selectedIndex = selected.indexOf(data);
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      } else {
        newSelected = newSelected.concat(selected, data);
      }
    } else if (this.props.selectable === 'single') {
      if (isSelected === true) {
        newSelected = [];
      } else {
        newSelected = [data];
      }
    }

    this.setState({ selected: newSelected });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      const { filters, tableData } = this.state;
      const results = common.stableFilter(tableData, filters);
      this.setState({ selected: results });
      return;
    } else {
      this.clearSelected();
    }
  };

  clearSelected = () => {
    this.setState({ selected: [] });
  };

  handleSaveCallback = (data) => {
    const { selected } = this.state;
    if (Array.isArray(selected) && selected.length === 1) {
      // 変更成功の場合、変更後のデータをテーブルに更新する
      this.setState({selected: [data]});
    }
  };

  render() {
    const {
      classes, tableHead, tableActions, rowActions, toolbar, selectable, allowCsv, pk, showTitle, showAggregate,
      addProps, editProps, deleteProps, filterLayout, width, tableStyles,
    } = this.props;
    const { tableData, filters, page, rowsPerPage, order, orderBy, orderNumeric, selected } = this.state;
    let results = common.stableSort(tableData, common.getSorting(order, orderBy, orderNumeric));
    if (!common.isEmpty(filters)) {
      results = common.stableFilter(results, filters);
    }
    const headerProps = {
      classes: classes,
      tableHeaderColor: this.props.tableHeaderColor,
      tableHead: tableHead,
      onSort: this.handleSort,
      order: order,
      orderBy: orderBy,
      selectable: selectable,
      selected: selected,
      data: results,
      onSelectAllClick: this.handleSelectAllClick,
    };
    const toolbarProps = {
      title: this.props.title,
      showTitle: showTitle,
      filters: filters,
      filterLayout: filterLayout,
      tableHead: tableHead,
      tableData: results,
      selected: selected,
      onChangeFilter: this.handleChangeFilter,
      tableActions: tableActions,
      rowActions: rowActions,
      allowCsv: allowCsv,
      pk: pk,
      addProps: addProps,
      editProps: editProps,
      saveCallback: this.handleSaveCallback,
      deleteProps: deleteProps,
      clearSelected: this.clearSelected,
    };

    return (
      <div className={classes.tableResponsive}>
        {toolbar ? (
          <DataTableToolbar
            id={this.toolbarId}
            {...toolbarProps}
          />
        ) : null}
        <div style={{width: 'auto', overflowX: "auto"}} onScroll={this.handleFixedHeader}>
        <Table className={classes.table} id={this.tableId} {...this.props.tableProps} style={{...tableStyles}}>
          <DataTableHead
            {...headerProps}
          />
          <TableBody>
            {results.length > 0 ? (
              common.getDataForDisplay(results, rowsPerPage, page)
              .map((row, key) => {
                const rowStyles = common.getExtraRowStyles(row, tableHead);
                const isSelected = this.isSelected(row);
                let chkCell = null;
                if (selectable === 'multiple' || selectable === 'single') {
                  chkCell = (
                    <TableCell padding="none">
                      <Checkbox checked={isSelected} onClick={() => this.handleRowSelect(row)} />
                    </TableCell>
                  );
                }
                return (
                  <TableRow
                    key={key}
                    className={classes.tableRow}
                    role="checkbox"
                    aria-checked={isSelected}
                    selected={isSelected}
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
          rowsPerPageOptions={this.props.rowsPerPageOptions}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
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

MyEnhancedTable.propTypes = {
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

MyEnhancedTable.defaultProps = {
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

const EnhancedTable = withRouter(withStyles(tableStyle)(withWidth()(MyEnhancedTable)));
export { EnhancedTable } ;
