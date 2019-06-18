import React from 'react';
import {EnhancedTable} from '../../src/index';
import {columns, rows} from './data';

const MyEnhancedTable = () => (
  <div>
    <EnhancedTable
      tableHead={columns}
      tableData={rows}
      rowsPerPage={10}
      tableHeaderColor={'warning'}
      pk='pk'
      server={false}
      title="テーブルのタイトルです"
    />
  </div>
);
export default MyEnhancedTable;