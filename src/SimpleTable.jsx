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

  getDataForDisplay = (data, rowsPerPage, page) => {
    let results = null;
    if (!rowsPerPage) {
      results = data;
    } else {
      results = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }
    return results;
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
            {this.getDataForDisplay(tableData, rowsPerPage, page)
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
        {tableData.length > rowsPerPage ? (
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

MySimpleTable.defaultProps = {
  tableHeaderColor: "gray",
  tableHead: [],
  tableData: [],
  rowsPerPage: null,
};

MySimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.object),
  rowsPerPage: PropTypes.number,
  tableProps: PropTypes.object,
};

const SimpleTable = withStyles(tableStyle)(MySimpleTable)
export { SimpleTable } ;
