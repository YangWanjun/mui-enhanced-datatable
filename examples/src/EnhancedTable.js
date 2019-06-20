import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {EnhancedTable} from '../../src/index';
import {columns, rows} from './data';

class MyEnhancedTable extends React.Component {

  

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
        tableActions={[
          {
            'tooltip': 'レコード追加',
            'icon': <AddIcon/>,
            'handleClick': () => (console.log('Data Added')),
          }
        ]}
        rowActions={[
          {
            'tooltip': 'レコード変更',
            'icon': <EditIcon/>,
            'handleClick': (data) => (console.log(data)),
          }
        ]}
        allowCsv={true}
      />
    );
  }
}

export default MyEnhancedTable;