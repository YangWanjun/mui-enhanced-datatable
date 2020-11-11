import { common } from "../utils";

/**
 * テーブルのセルに表示するとき、右揃えか、左揃えか中央揃えかを取得する。
 * @param {String} colType データの種類
 */
export const getCellAlignment = (colType) => {
  if (['decimal', 'integer', 'percent'].indexOf(colType) >= 0) {
    return { align: 'right', numeric: true };
  } else if (colType === 'boolean') {
    return { align: 'center', numeric: false };
  } else {
    return { align: 'left', numeric: false };
  }
};

/**
 * テーブルの行が選択されたかどうか
 * @param {Object} row 現在行のデータ
 * @param {Array} selected 選択された行のID
 * @param {String} pkName 主キーのID
 */
export const isSelected = (row, selected, pkName) => {
  if (common.isEmpty(row)) {
    return false;
  }

  let key = null;
  if (row.__index__ !== null && row.__index__ !== undefined) {
    key = '__index__';
  } else {
    key = pkName;
  }

  if (!selected) {
    return false;
  } else {
    return selected.filter(r => r[key] === row[key]).length > 0;
  }
};

export const onRowSelect = (data, selectable, selected) => {
  if (selectable === 'none') {
    return;
  }
  
  const is_selected = isSelected(data, selected);
  let newSelected = [];
  if (selectable === 'multiple') {
    if (is_selected === true) {
      const selectedIndex = selected.indexOf(data);
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    } else {
      newSelected = newSelected.concat(selected, data);
    }
  } else if (selectable === 'single') {
    if (is_selected === true) {
      newSelected = [];
    } else {
      newSelected = [data];
    }
  }

  return { selected: newSelected }
};
