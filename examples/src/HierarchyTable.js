import React from 'react';
import {HierarchyTable} from '../../src/index';
import {hierarchyColumns, hierarchyRows} from './data';

const MyHierarchyTable = () => (
  <div>
    <HierarchyTable
      tableHead={hierarchyColumns}
      tableData={hierarchyRows}
      rowsPerPage={10}
      tableHeaderColor={'warning'}
      pk='pk'
    />
  </div>
);
export default MyHierarchyTable;