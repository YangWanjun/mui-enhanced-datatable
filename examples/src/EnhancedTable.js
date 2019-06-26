import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {EnhancedTable, Form} from '../../src/index';
import {columns, rows, add_schema} from './data';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

class MyEnhancedTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleOk = () => {
    if (this._handleOk) {
      const data = this._handleOk();
      console.log(data);
    }
  };

  render() {
    const { open } = this.state;

    return (
      <div>
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
              'handleClick': this.handleOpen,
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
          urlReflect={true}
        />
        <Dialog
          open={open}
          onClose={this.handleClose}
        >
          <DialogTitle>
            データを追加
          </DialogTitle>
          <DialogContent dividers>
            <Form
              schema={add_schema}
              ref={(form) => {
                this._handleOk = form && form.handleOk;
              }}
              // errors={{non_field_errors: [
              //   '唯一の名前を入力してください。', 
              //   '存在しないクラスです、正しいクラスを入力してください', 
              //   'この項目は必須です。'
              // ]}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>キャンセル</Button>
            <Button onClick={this.handleOk} autoFocus={true}>確定</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default MyEnhancedTable;