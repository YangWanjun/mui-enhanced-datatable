import React from 'react';
import {
  Table,
} from "@material-ui/core";

class DataTableFixedHead extends React.Component {
  render() {
    const { classes, id, children, fixedPosition } = this.props;

    return (
      <Table
        id={id}
        className={classes.table + ' ' + classes.tableFixedHeader}
        aria-labelledby="fixedHeader"
        style={{
          position: "fixed",
          backgroundColor: 'white',
          tableLayout: 'fixed',
          ...fixedPosition,
        }}
      >
        {children}
      </Table>
    );
  }
}

export default DataTableFixedHead;