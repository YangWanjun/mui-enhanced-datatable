import common from "./common";

export default {
  /**
   * テーブルのデータを初期化する
   * @param {Array} data デーブルデータ
   */
  initTableData: function(data) {
    if (data) {
      data.map((row, index) => row['__index__'] = index);
    }
    return data;
  },

  /**
   * ＵＲＬから並び順を取得
   * @param {String} location URL
   */
  getOrder: function(location) {
    let order = {'__order': 'asc', '__orderBy': ''};
    if (location && location.search) {
      const json = common.urlToJson(location.search);
      const order_by = json.__order;
      const orderNumeric = json.__orderNumeric;
      if (order_by && order_by[0] === '-') {
        order['__order'] = 'desc';
        order['__orderBy'] = order_by.slice(1);
      } else {
        order['__orderBy'] = order_by;
      }
      order['__orderNumeric'] = orderNumeric;
    }
    return order;
  },

  /**
   * 
   * @param {String} order 昇順／降順
   * @param {String} orderBy 並び替え項目
   * @param {Boolean} orderNumeric 数字に対する並び替えなのかどうか
   * @param {String} location ＵＲＬ
   * @param {Object} history 
   */
  changeOrderUrl: function(order, orderBy, orderNumeric, location, history) {
    let json = common.urlToJson(location.search);
    json['__order'] = (order === 'asc' ? '' : '-') + orderBy;
    json['__orderNumeric'] = orderNumeric;
    history.push({
      'pathname': location.pathname,
      'search': common.jsonToUrl(json),
    });
  },

  /**
   * 
   * @param {String} page 何ページ目
   * @param {String} location ＵＲＬ
   * @param {*} history 
   */
  changePaginationUrl: function(page, location, history) {
    let json = common.urlToJson(location.search);
    json['__page'] = page;
    history.push({
      'pathname': location.pathname,
      'search': common.jsonToUrl(json),
    });
  },

  changePageSizeUrl: function(pageSize, location, history) {
    let json = common.urlToJson(location.search);
    json['__rowsPerPage'] = pageSize;
    history.push({
      'pathname': location.pathname,
      'search': common.jsonToUrl(json),
    });
  },

  /**
   * フィルター項目をＵＲＬに反映する
   * @param {JSON} filters フィルター項目
   * @param {String} location ＵＲＬ
   * @param {Object} history 
   */
  changeFilterUrl: function(filters, location, history) {
    let json = common.urlToJson(location.search);
    Object.keys(json).map(key => {
      if (key.slice(0, 2) !== '__') {
        delete json[key];
      }
      return true;
    });
    Object.assign(json, filters);
    history.push({
      'pathname': location.pathname,
      'search': common.jsonToUrl(json),
    });
  },

  /**
   * ＵＲＬからフィルターを取得する
   * @param {String} location ＵＲＬ
   */
  loadFilters: function(location, columns) {
    if (location && location.search) {
      let json = common.urlToJson(location.search);
      Object.keys(json).map(key => {
        if (key.slice(0, 2) === '__') {
          delete json[key];
        }
        const column = common.getFromList(columns, 'name', key);
        if (column) {
          if (column.type === "integer") {
            json[key] = parseInt(json[key]);
          } else if (column.choices && !common.isEmpty(column.choices)) {
            if (typeof column.choices[0].value === 'number') {
              json[key] = parseFloat(json[key]);
            }
          }
        }
        return true;
      });
      return json;
    } else {
      return {};
    }
  },

  resetFilter: function(filters, columns) {
    Object.keys(filters).map(key => {
      const column = common.getFromList(columns, 'name', key);
      if (column) {
        if (column.type === "integer") {
          filters[key] = parseInt(filters[key]);
        } else if (column.choices && !common.isEmpty(column.choices)) {
          if (typeof column.choices[0].value === 'number') {
            if (filters[key] && filters[key].value) {
              // 階層型のデータをフィルターの場合
              filters[key].value = parseFloat(filters[key].value);
            } else {
              filters[key] = parseFloat(filters[key]);
            }
          }
        }
      }
      return true;
    });
    return Object.assign({}, filters);
  },

  /**
   * DataTableのフィルターからajax呼び出し要のデータを取得する
   * @param {JSON} filters フォルダー
   * @returns 
   */
   getParamFromFilter: function(filters) {
    const param = {};
    Object.keys(filters).map(key => {
      if (common.isJSON(filters[key]) && 'value' in filters[key]) {
        param[key] = filters[key].value;
      } else {
        param[key] = filters[key];
      }
      return null;
    });
    return param;
  },

  /**
   * テーブルのセルに表示するとき、右揃えか、左揃えか中央揃えかを取得する。
   * @param {String} colType データの種類
   */
  getCellAlignment: function(colType) {
    if (['decimal', 'integer', 'percent'].indexOf(colType) >= 0) {
      return { align: 'right', numeric: true };
    } else if (colType === 'boolean') {
      return { align: 'center', numeric: false };
    } else {
      return { align: 'left', numeric: false };
    }
  },

  /**
   * テーブルの行が選択されたかどうか
   * @param {Object} row 現在行のデータ
   * @param {Array} selected 選択された行のID
   * @param {String} pkName 主キーのID
   */
  isSelected: (row, selected, pkName) => {
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
  },

  onRowSelect: (data, selectable, selected) => {
    if (selectable === 'none') {
      return;
    }
    
    const is_selected = this.isSelected(data, selected);
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
  },
};
