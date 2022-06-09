import React, { useState } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Table,
  TableRow,
  TableBody,
  makeStyles,
} from "@material-ui/core";
// core components
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import DataTablePagination from './DataTablePagination';
import tableStyle from "../assets/css/datatable";
import { common, constant } from "../utils";

const useStyles = makeStyles(tableStyle);

function SimpleTable(props) {
  const { tableHead, tableData, tableProps, rowsPerPage, tableHeaderColor } = props;
  const [ page, setPage ] = useState(0);
  const classes = useStyles();

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table} {...tableProps}>
        <DataTableHead
          classes={classes}
          tableHeaderColor={tableHeaderColor}
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
          onPageChange={handleChangePage}
        />
      ) : <React.Fragment/> }
    </div>
  );
}

SimpleTable.propTypes = {
  ...constant.tableProps,
  rowsPerPage: PropTypes.number,
};

SimpleTable.defaultProps = {
  ...constant.tablePropsDefault,
  rowsPerPage: null,
};

export default SimpleTable;
