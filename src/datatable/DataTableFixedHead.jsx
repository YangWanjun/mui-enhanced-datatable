import React from 'react';
import PropTypes from "prop-types";
import {
  Table,
} from "@material-ui/core";

function DataTableFixedHead(props) {
  const { classes, id, tableId, tableHeader, toolbar } = props;

  return (
    <div id={id} className={classes.tableFixedHeader}>
      {toolbar}
      <Table
        id={tableId}
        className={classes.table}
        aria-labelledby="fixedHeader"
      >
        {tableHeader}
      </Table>
    </div>
  );
}

DataTableFixedHead.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  tableId: PropTypes.string,
  tableHeader: PropTypes.object,
  toolbar: PropTypes.any,
};

export default DataTableFixedHead;