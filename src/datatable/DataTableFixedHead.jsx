import React from 'react';
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

export default DataTableFixedHead;