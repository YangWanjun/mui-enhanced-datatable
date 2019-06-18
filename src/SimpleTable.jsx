import React from "react";
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
    const { classes, tableHeaderColor, tableHead, tableData, tableProps, rowsPerPage } = this.props;
    const { page } = this.state;

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table} {...tableProps}>
          <DataTableHead
            {...{classes, tableHeaderColor, tableHead}}
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
            onChangePage={this.handleChangePage}
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
