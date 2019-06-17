import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Table,
  TableRow,
  TableBody,
  TablePagination,
} from "@material-ui/core";
// core components
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import tableStyle from "./styles";

class SimpleTable extends React.Component {

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
    const { classes, tableHeaderColor, tableHead, tableData, rowsPerPage, tableProps } = this.props;
    const { page } = this.state;
    console.log(tableProps)

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table} {...tableProps}>
          <DataTableHead
            {...{classes, tableHeaderColor, tableHead}}
          />
          <TableBody>
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, key) => {
                return (
                  <TableRow key={key}>
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
          <TablePagination
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

SimpleTable.defaultProps = {
  tableHeaderColor: "gray",
  tableHead: [],
  tableData: [],
  rowsPerPage: 10,
};

SimpleTable.propTypes = {
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

export default withStyles(tableStyle)(SimpleTable);
