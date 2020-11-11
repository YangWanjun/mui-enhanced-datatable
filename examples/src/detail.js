import React from 'react';
import {TableDetail} from '../../src/index';
import { common } from '../../src/utils';
import {columns, rows} from './data';

class Detail extends React.Component {

  render() {
    const { pk } = this.props.match.params;
    const detail = common.getFromList(rows, "pk", parseInt(pk));

    return (
      <div>
        <TableDetail
          schema={columns}
          data={detail}
          editProps={{
            title: '社員情報変更',
            schema: columns,
            handleEdit: (data) => console.log(data),
          }}
          deleteProps={{
            title: '社員情報削除',
            handleDelete: (data) => console.log(data),
          }}
        />
      </div>
    );
  }
}
export default Detail;