import React from 'react';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "@material-ui/core";

const Detail = () => (
  <div>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>名前</TableCell>
          <TableCell>李さん</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>クラス</TableCell>
          <TableCell>３-Ａ</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
export default Detail;