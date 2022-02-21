import React from "react";
import PropTypes from "prop-types";
// @mui/material components
import withStyles from "@mui/styles/withStyles";
import {
  Table,
  TableRow,
  TableBody,
} from "@mui/material";
// core components
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import DataTablePagination from './DataTablePagination';
import tableStyle from "../assets/css/datatable";
import { common } from "../utils/common";
import { constant } from "../utils/constant";

class MySimpleTable extends React.Component {

  constructor(props) {
    super(props);

    this.handleChangePage = this.handleChangePage.bind(this);
    this.state = {
      page: 0,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  render () {
    const { classes, tableHead, tableData, tableProps, rowsPerPage } = this.props;
    const { page } = this.state;

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table} {...tableProps}>
          <DataTableHead
            classes={classes}
            tableHeaderColor={this.props.tableHeaderColor}
            tableHead={tableHead}
            sortable={false}
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
        {(rowsPerPage && tableData.length > rowsPerPage) ? (
          <DataTablePagination
            component="div"
            // id={paginationId}
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onPageChange={this.handleChangePage}
          />
        ) : <React.Fragment/> }
      </div>
    );
  }
}

MySimpleTable.propTypes = {
  ...constant.tableProps,
  rowsPerPage: PropTypes.number,
};

MySimpleTable.defaultProps = {
  ...constant.tablePropsDefault,
  rowsPerPage: null,
};

const SimpleTable = withStyles(tableStyle)(MySimpleTable)
export { SimpleTable } ;
