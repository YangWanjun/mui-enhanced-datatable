import React from 'react';
import {
  Table,
} from "@material-ui/core";

class DataTableFixedHead extends React.Component {
  render() {
    const { classes, children, fixedHeaderPosition } = this.props;
    return (
      <Table
        className={classes.table}
        aria-labelledby="fixedHeader"
        style={{
          position: "fixed",
          backgroundColor: 'white',
          tableLayout: 'fixed',
          ...fixedHeaderPosition,
        }}
      >
        {children}
      </Table>
    );
  }
}

export default DataTableFixedHead;