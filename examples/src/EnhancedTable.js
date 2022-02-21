import React, { useState } from 'react';
import MoodIcon from '@mui/icons-material/Mood';
import {EnhancedTable, FormDialog} from '../../src/index';
import {columns, rows} from './data';
import { common } from '../../src/utils';

const MyEnhancedTable = (props) => {
  let _showMultiTabs = null;

  const [tableData, setTableData] = useState(common.clone(rows));

  const handleOpenMultiTab = () => {
    if (_showMultiTabs) {
      _showMultiTabs(tableData.slice(0, 6), tableData.slice(0, 5).map(item => item.name));
    }
  };

  const handleAddData = (data) => {
    return fetch('./').then(results => {
      setTableData([].concat(tableData, [data]));
    }).catch(errors => {
      console.log(errors);
    });
  };

  const handleEditData = (data) => {
    return fetch('./').then(results => {
      const selectedIndex = tableData.map(row => row.pk).indexOf(data.pk);
      setTableData([].concat(
        tableData.slice(0, selectedIndex),
        [data],
        tableData.slice(selectedIndex + 1),
      ));
    }).catch(errors => {
      console.log(errors);
    });
  };

  const handleDeleteData = (data) => {
    return fetch('./').then(results => {
      const selectedIndex = tableData.map(row => row.pk).indexOf(data.pk);
      setTableData([].concat(
        tableData.slice(0, selectedIndex),
        tableData.slice(selectedIndex + 1),
      ))
    }).catch(errors => {
      console.log(errors);
    });
  };

  return (
    <div>
      <EnhancedTable
        title="社員一覧"
        showTitle={true}
        tableHead={columns}
        tableData={tableData}
        rowsPerPage={25}
        tableHeaderColor={'warning'}
        pk='pk'
        server={false}
        toolbar={true}
        pushpinTop={0}
        filters={{retired: false}}
        selectable={'single'}
        tableActions={[
          {
            'tooltip': 'テストダイアログ',
            'icon': <MoodIcon />,
            'handleClick': handleOpenMultiTab,
          }
        ]}
        addProps={{
          title: '社員情報追加',
          schema: columns,
          handleOk: handleAddData,
        }}
        editProps={{
          title: '社員情報変更',
          schema: columns,
          handleOk: handleEditData,
        }}
        deleteProps={{
          handleDelete: handleDeleteData,
        }}
        allowCsv={true}
        urlReflect={true}
      />
      <FormDialog
        innerRef={(dlg) => { _showMultiTabs = dlg && dlg.handleOpen }}
        title={'テスト'}
        schema={columns}
        handleOk={() => console.log('handleOk')}
        saveCallback={() => console.log('saveCallback')}
      />
    </div>
  );
}

export default MyEnhancedTable;