import React from 'react';
import {TableDetail} from '../../src/index';
import { common } from '../../src/utils';
import {columns, rows, memberHistory} from './data';

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
            handleEdit: (data) => Promise.resolve(data),
          }}
          deleteProps={{
            title: '社員情報削除',
            handleDelete: (data) => {
              return Promise.resolve(data);
            },
          }}
          histories={memberHistory}
        />
      </div>
    );
  }
}
export default Detail;