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
import DataTablePagination from './DataTablePagination';
import DataTableToolbar from "./DataTableToolbar";
import tableStyle from "./styles";
import { common } from "./common";
import { constant } from "./constant";

class MyEnhancedTable extends React.Component {
  tableId = uuid();

  constructor(props) {
    super(props);

    this.state = {
      tableData: common.initTableData(props.tableData),
      page: 0,
      rowsPerPage: props.rowsPerPage,
      order: 'asc',
      orderBy: '',
      orderNumeric: false,
      filters: props.filters,
      showFixedHeader: false,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  handleChangeRowsPerPage = event => {
    if (this.props.server) {
    } else {
      this.setState({ rowsPerPage: event.target.value });
    }
  };

  handleSort = (event, property, orderNumeric) => {
    const orderBy = property;
    let order = 'desc';
    let order_by = property;

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    } else {
      order_by = '-' + order_by;
    }
    this.setState({ order, orderBy, orderNumeric });
  };

  handleChangeFilter = (filters) => {
    this.setState({ filters });
  }

  render() {
    const { classes, tableHead, tableData, tableActions, rowActions } = this.props;
    const { filters, page, rowsPerPage, order, orderBy, orderNumeric } = this.state;
    let results = common.stableSort(tableData, common.getSorting(order, orderBy, orderNumeric));
    if (!common.isEmpty(filters)) {
      results = common.stableFilter(results, filters);
    }

    return (
      <div className={classes.tableResponsive}>
        <DataTableToolbar
          title={this.props.title}
          filters={filters}
          tableHead={tableHead}
          onChangeFilter={this.handleChangeFilter}
        />
        <Table className={classes.table} id={this.tableId} {...this.props.tableProps}>
          <DataTableHead
            classes={classes}
            tableHeaderColor={this.props.tableHeaderColor}
            tableHead={tableHead}
            actions={tableActions ? tableActions : (rowActions ? true : false)}
            onSort={this.handleSort}
            order={order}
            orderBy={orderBy}
          />
          <TableBody>
            {common.getDataForDisplay(results, rowsPerPage, page)
              .map((row, key) => {
                return (
                  <TableRow key={key} hover>
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
            })}
          </TableBody>
        </Table>
        <DataTablePagination
          component="div"
          // id={paginationId}
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
      </div>
    );
  }
}

MyEnhancedTable.propTypes = {
  ...constant.tableProps,
  ...constant.tableActionProps,
  selectable: PropTypes.oneOf(['none', 'single']),
  pk: PropTypes.string,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  server: PropTypes.bool,
  title: PropTypes.string,
  filters: PropTypes.object,
};

MyEnhancedTable.defaultProps = {
  ...constant.tablePropsDefault,
  ...constant.tableActionPropsDefault,
  selectable: 'none',
  pk: 'id',
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 25, 50],
  server: false,
  title: null,
  filters: {},
};

const EnhancedTable = withStyles(tableStyle)(MyEnhancedTable)
export { EnhancedTable } ;
