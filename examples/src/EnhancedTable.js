import React from 'react';
import MoodIcon from '@material-ui/icons/Mood';
import {EnhancedTable, FormDialog} from '../../src/index';
import {columns, rows} from './data';
import { common } from '../../src/utils';

class MyEnhancedTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData: common.clone(rows),
    };
  }

  handleOpenMultiTab = () => {
    const { tableData } = this.state;
    if (this._showMultiTabs) {
      this._showMultiTabs(tableData.slice(0, 6), tableData.slice(0, 5).map(item => item.name));
    }
  };

  handleAddData = (data) => {
    const { tableData } = this.state;
    return fetch('./').then(results => {
      this.setState({
        tableData: [].concat(
          tableData,
          [data],
        ),
      });
    }).catch(errors => {
      console.log(errors);
    });
  };

  handleEditData = (data) => {
    const { tableData } = this.state;
    return fetch('./').then(results => {
      const selectedIndex = tableData.map(row => row.pk).indexOf(data.pk);
      this.setState({
        tableData: [].concat(
          tableData.slice(0, selectedIndex),
          [data],
          tableData.slice(selectedIndex + 1),
        ),
      });
    }).catch(errors => {
      console.log(errors);
    });
  };

  handleDeleteData = (data) => {
    const { tableData } = this.state;
    return fetch('./').then(results => {
      const selectedIndex = tableData.map(row => row.pk).indexOf(data.pk);
      this.setState({
        tableData: [].concat(
          tableData.slice(0, selectedIndex),
          tableData.slice(selectedIndex + 1),
        ),
      });
    }).catch(errors => {
      console.log(errors);
    });
  };

  render() {
    const { tableData } = this.state;

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
              'handleClick': this.handleOpenMultiTab,
            }
          ]}
          addProps={{
            title: '社員情報追加',
            schema: columns,
            handleOk: this.handleAddData,
          }}
          editProps={{
            title: '社員情報変更',
            schema: columns,
            handleOk: this.handleEditData,
          }}
          deleteProps={{
            handleDelete: this.handleDeleteData,
          }}
          allowCsv={true}
          urlReflect={true}
        />
        <FormDialog
          innerRef={(dlg) => { this._showMultiTabs = dlg && dlg.handleOpen }}
          title={'テスト'}
          schema={columns}
          handleOk={() => console.log('handleOk')}
          saveCallback={() => console.log('saveCallback')}
        />
      </div>
    );
  }
}

export default MyEnhancedTable;