import React from 'react';
import {EnhancedTable} from '../../src/index';
import {columns, rows} from './data';

class MyEnhancedTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  render() {
    return (
      <EnhancedTable
        tableHead={columns}
        tableData={rows}
        rowsPerPage={25}
        tableHeaderColor={'warning'}
        pk='pk'
        server={false}
        title="テーブルのタイトルです"
        toolbar={true}
        pushpinTop={0}
        filters={{retired: false}}
        selectable={'multiple'}
      />
    );
  }
}

export default MyEnhancedTable;