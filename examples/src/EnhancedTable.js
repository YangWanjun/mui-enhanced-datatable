import React from 'react';
import {EnhancedTable} from '../../src/index';
import {columns, rows} from './data';

const MyEnhancedTable = () => (
  <div>
    <EnhancedTable
      tableHead={columns}
      tableData={rows}
      rowsPerPage={30}
      tableHeaderColor={'warning'}
      pk='pk'
      server={false}
      title="テーブルのタイトルです"
      toolbar={true}
    />
  </div>
);
export default MyEnhancedTable;