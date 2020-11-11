import React from 'react';
import {HierarchyTable} from '../../src/index';
import {hierarchyColumns, departments} from './data';

const MyHierarchyTable = () => (
  <div>
    <HierarchyTable
      tableHead={hierarchyColumns}
      tableData={departments}
      tableHeaderColor={'warning'}
      pk='pk'
    />
  </div>
);
export default MyHierarchyTable;