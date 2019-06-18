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

  render() {
    const { classes, tableHead, tableData, tableActions, rowActions } = this.props;
    const { page, rowsPerPage } = this.state;

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table} id={this.tableId} {...this.props.tableProps}>
          <DataTableHead
            classes={classes}
            tableHeaderColor={this.props.tableHeaderColor}
            tableHead={tableHead}
            actions={tableActions ? tableActions : (rowActions ? true : false)}
          />
          <TableBody>
            {common.getDataForDisplay(tableData, rowsPerPage, page)
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
          count={tableData.length}
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
};

MyEnhancedTable.defaultProps = {
  ...constant.tablePropsDefault,
  ...constant.tableActionPropsDefault,
  selectable: 'none',
  pk: 'id',
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 25, 50],
  server: false,
};

const EnhancedTable = withStyles(tableStyle)(MyEnhancedTable)
export { EnhancedTable } ;
