import React from 'react';
import {SimpleTable} from '../../src/index';
import {columns, rows} from './data';

const MySimpleTable = () => (
  <div>
    <SimpleTable
      tableHead={columns}
      tableData={rows}
      tableHeaderColor={'warning'}
    />
  </div>
);
export default MySimpleTable;