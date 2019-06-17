import React from 'react';
import SimpleTable from './SimpleTable';
import {columns, rows} from './data';

const MyComponent = () => (
    <SimpleTable
      tableHead={columns}
      tableData={rows}
    />
);
export default MyComponent;