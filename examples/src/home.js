import React from 'react';
import {SimpleTable} from '../../src/index';
import {columns, rows} from './data';

const Home = () => (
  <div>
    <SimpleTable
      tableHead={columns}
      tableData={rows}
      rowsPerPage={10}
      tableProps={{size: 'small'}}
      tableHeaderColor={'warning'}
    />
  </div>
);
export default Home;