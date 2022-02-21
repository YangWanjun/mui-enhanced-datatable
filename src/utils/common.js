import React from 'react';
import { vsprintf } from 'sprintf-js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Link } from '@mui/material';

export const common = {

  /**
   * 整数に変更する
   * @param {String} num 
   */
  toInteger: function(num, radix=10) {
    let val = parseInt(num, radix);
    return isNaN(val) ? 0 : val;
  },

  /**
   * 数字をカンマ区切りで表示
   * @param {Integer} num 数字
   */
  toNumComma: function(num) {
    if (num === null || num === undefined) {
      return '';
    } else {
      const int_comma = (num + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      return int_comma;
    }
  },

  /**
   * オブジェクトは空白なのか
   * @param {Object} obj 
   */
  isEmpty: function(obj) {
    if (obj === null || obj === undefined || obj === '') {
      return true;
    } else if (Array.isArray(obj)) {
      return obj.length === 0;
    } else if (typeof obj === 'number') {
      return false;
    }
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  },

  clone: function(data) {
    return JSON.parse(JSON.stringify(data)); 
  },

  /**
   * JSON項目のリストから項目を取得
   * @param {Array} json_list 
   * @param {String} value 
   */
  getFromList: function(json_list, key, value) {
    if (!json_list) {
      return {};
    } else if (json_list.length === 0) {
      return {};
    } else if (typeof value === 'undefined') {
      return {};
    } else {
      if (typeof value === 'string') {
        value = value.split('__')[0];
      }
      let cols = json_list.filter(col => col[key] === value);
      return cols.length > 0 ? cols[0] : {};
    }
  },

  getChildren: function(value, items, key='value', parent='parent') {
    let filter_in = [];
    items.map(item => {
      if ((item[parent] + '') === (value + '')) {
        filter_in.push(item[key]);
        filter_in = filter_in.concat(this.getChildren(item[key], items, key, parent));
      }
      return item;
    });
    return filter_in;
  },

  /**
   * JSONかどうかを判定する関数
   * @param {Object} arg 
   */
   isJSON: function(arg) {
    return typeof arg === 'object';
  },

  /**
   * 文字列をフォーマットする
   * @param {String} format 
   *
   * 使用方法：utils.format('This is argument: %s', arg1);
   */
  formatStr: function(format, args) {
    return vsprintf(format, args);
  },

  /**
   * 
   * @param {Array} data テーブルのデータ
   * @param {Integer} rowsPerPage 一ページに表示する行数
   * @param {Integer} page 現在は何ページ目
   */
  getDataForDisplay: function(data, rowsPerPage, page) {
    let results = null;
    if (!rowsPerPage) {
      results = data;
    } else {
      results = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }
    return results;
  },

  /**
   * 並び替え
   * @param {Array} array 
   * @param {Function} cmp 
   */
  stableSort: function(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);  
  },

  /**
   * JSONの配列にデータを検索する
   * @param {Array} array 
   * @param {JSON} filters 
   */
  stableFilter: function(array, filters) {
    Object.keys(filters).map(key => {
      array = array.filter(function(item) {
        let item_value = item[key];
        if (filters[key] && Array.isArray(filters[key].children)) {
          // 組織などの階層化に対しての検索、すべての子項目を含めて検索
          return filters[key].value === item_value || filters[key].children.indexOf(item_value) >= 0;
        } else if (item_value === true || item_value === false) {
          return (filters[key] === true || filters[key] === false) ? item_value === filters[key] : true;
        } else if (filters[key] === true || filters[key] === false) {
          return item_value === (filters[key] === true ? 1 : 0);
        } else if (typeof item_value === 'number') {
          return item_value === filters[key];
        } else if (item_value) {
          return item_value.indexOf(filters[key]) >= 0;
        } else {
          return false;
        }
      })
      return array;
    });
    return array;
  },

  /**
   * 
   * @param {String} order 昇順／降順
   * @param {String} orderBy 並び替え項目
   * @param {Boolean} isNumeric 並び替え項目が数字かどうか
   */
  getSorting: function(order, orderBy, isNumeric) {
    if (isNumeric) {
      return order === 'desc'
      ? (a, b) => ((Number.isInteger(b[orderBy]) ? b[orderBy] : -1) - (Number.isInteger(a[orderBy]) ? a[orderBy] : -1))
      : (a, b) => ((Number.isInteger(a[orderBy]) ? a[orderBy] : -1) - (Number.isInteger(b[orderBy]) ? b[orderBy] : -1));
    } else {
      return order === 'desc'
      ? (a, b) => ((b[orderBy] || '') < (a[orderBy] || '') ? -1 : 1)
      : (a, b) => ((a[orderBy] || '') < (b[orderBy] || '') ? -1 : 1);
    }
  },

  getLabelFromColumn: function(value, column) {
    let label = value;
    if (column === null || column === undefined) {

    } else if (column.choices && !this.isEmpty(column.choices)) {
      let item = this.getFromList(column.choices, 'value', value);
      if (item) {
        label = item.display_name;
      }
    } else if (column.type === 'boolean') {
      if (value === true) {
        label = column.label;
      } else if (value === false) {
        label = column.label + 'ではない';
      }
    }
    return label;
  },

  /**
   * 項目の定義からＣＳＳスタイルを取得する
   * @param {JSON} rowData 
   */
  getExtraRowStyles: function(rowData, tableHead) {
    let extraStyles = {};
    const columns = tableHead.filter(col => col.hasOwnProperty('rowStyles'));
    columns.map(col => {
      let styles = col.rowStyles[rowData[col.name]];
      return Object.assign(extraStyles, styles);
    });
    return extraStyles;
  },

  getColumnDisplay: function(value, column, data, styles={}) {
    switch (column.type) {
      case 'choice':
        return common.getDisplayNameFromChoice(value, column);
      case 'choices':
        return common.getDisplayNameFromChoices(value, column);
      case 'boolean':
        if (value === true || value === 1) {
          return <CheckCircleIcon fontSize="small" style={{color: 'green'}} />;
        } else if (value === false || value === 0) {
          return <HighlightOffIcon fontSize="small" style={{color: 'red'}} />;
        } else {
          return null;
        }
      case 'integer':
      case 'decimal':
        return common.toNumComma(value);
      case 'percent':
        value = parseFloat(value) * 100;
        if (!isNaN(value)) {
          if (column.decimal_digits >= 0) {
            value = value.toFixed(column.decimal_digits);
          } else {
            value = value.toFixed(2);
          }
          value += '%';
        } else {
          value = null;
        }
        return value;
      case 'text':
        return (
          <div style={{whiteSpace: 'pre-line', ...styles}}>
            {value}
          </div>
        );
      case 'file':
        let display_name = value;
        if (!common.isEmpty(data) && column.verbose_name) {
          display_name = data[column.verbose_name];
        }
        if (column.handle_download) {
          return (
            <Link
              component="button"
              variant="caption"
              onClick={() => column.handle_download(value, data)}
            >
              {display_name || ''}
            </Link>
          );
        } else {
          return display_name;
        }
      default:
        return value;
    }
  },

  /**
   * 選択肢から表示する名称を取得
   * @param {Object} value 選択肢の値
   * @param {JSON} column 項目のスキーマ
   */
  getDisplayNameFromChoice: function(value, column) {
    if (column.choices && !this.isEmpty(column.choices)) {
      const choice = this.getFromList(column.choices, 'value', value);
      const display_name = choice ? choice.display_name : null;
      return display_name || value;
    } else {
      return value;
    }
  },

    /**
   * 選択肢から表示する複数の名称を取得
   * @param {Array} values 選択肢の値リスト
   * @param {JSON} column 項目のスキーマ
   */
  getDisplayNameFromChoices: function(values, column) {
    if (column.choices && !this.isEmpty(column.choices)) {
      let display_name = '';
      let choice = null;
      let tmp_display_name = '';
      values.map(value => {
        choice = this.getFromList(column.choices, 'value', value);
        tmp_display_name = (choice ? choice.display_name : null) || '';
        display_name += ((display_name === '' ? '' : ', ') + tmp_display_name);
        return display_name;
      });
      return display_name;
    } else {
      return values;
    }
  },

  /**
   * テーブルのヘッダー部分を固定する
   * @param {String} wrapperId 固定部分のＩＤ
   * @param {String} toolbarId ToolbarのＩＤ
   * @param {String} srcTabelid テーブルのＩＤ
   * @param {String} fixedTableId 固定部分のテーブルＩＤ
   * @param {Integer} offset 
   */
  setFixedTableHeader: function(wrapperId, toolbarId, srcTabelid, fixedTableId, offset=0) {
    const wrapper = document.getElementById(wrapperId);
    const srcTable = document.getElementById(srcTabelid);
    const toolbar = document.getElementById(toolbarId);
    const fixedTable = document.getElementById(fixedTableId);
    if (!wrapper || !srcTable) {
      return;
    }
    let { left, width, top, height } = srcTable.getBoundingClientRect();
    const bodyHeight = srcTable.querySelector('tbody').getBoundingClientRect().height;
    if (bodyHeight) {
      height = bodyHeight;
    }
    if (toolbar) {
      top = toolbar.getBoundingClientRect().top;
    }

    if (top < offset && top > (offset - height)) {
      wrapper.style.display = 'inherit';
      wrapper.style.left = left + 'px';
      wrapper.style.width = width + 'px';
      wrapper.style.top = offset + 'px';
      // 各項目の長さを設定する
      let colsWidth = [];
      Array.prototype.forEach.call(srcTable.querySelector('thead>tr').children, function(ele, idx) {
        const colWidth = ele.getBoundingClientRect().width;
        colsWidth.push(colWidth);
      });
      Array.prototype.forEach.call(fixedTable.querySelector('thead>tr').children, function(ele, idx) {
        ele.style.width = colsWidth[idx] + 'px';
      });
    } else {
      wrapper.style.display = 'none';
    }
  },

  /**
   * DataTableのデータをＣＳＶに変換する
   * @param {Array} tableHead テーブルのヘッダー
   * @param {Array} tableData テーブルのデータ
   */
  dataTableToCSV: function(tableHead, tableData) {
    let self = this;
    let headArray = [];
    let csvArray = [];
    tableHead = tableHead.filter(col => (col.visible !== false || col.csv === true));
    tableHead = tableHead.filter(col => (col.csv !== false));
    tableHead.map(col => (
      headArray.push(col.label || col.name)
    ));
    csvArray.push(headArray);
    // データ部分をＣＳＶに入れる
    tableData.forEach(function(row) {
      let dataArray = [];
      tableHead.map(col => {
        let value = row[col.name];
        if (col.type === 'choice') {
          value = self.getDisplayNameFromChoice(value, col);
        }
        dataArray.push(value);
        return true;
      });
      csvArray.push(dataArray);
    });

    return this.arrayToCSV(csvArray);
  },

  arrayToCSV: function(array) {
    let lineArray = [];
    array.forEach(function (infoArray, index) {
      let line = infoArray.join('","');
      lineArray.push(`"${line}"`);
    });
    let csvContent = lineArray.join("\n");
    return csvContent;
  },

  downloadCSV: function (csvContent, filename) {
    if (filename) {
      filename += '.csv';
    } else {
      filename = 'export.csv';
    }
    let link = document.createElement('a');
    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    let blob = new Blob([bom, csvContent], { type: 'text/csv' });
    link.setAttribute('download', filename);
    if (window.webkitURL && window.webkitURL.createObjectURL) {
      // for chrome (and safari)
      link.setAttribute('href', window.webkitURL.createObjectURL(blob));
      link.click();
    } else if (window.URL && window.URL.createObjectURL) {
      // for firefox
      link.setAttribute('href', window.URL.createObjectURL(blob));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('サポートしないブラウザです。')
    }
  },

  downloadDataTableCSV: function(filename, tableHead, tableData) {
    const data = this.dataTableToCSV(tableHead, tableData);
    this.downloadCSV(data, filename);
  },

  /**
   * JSONデータをＵＲＬ用のパラメーターに変換する
   * @param {Object} json JSONデータ
   */
  jsonToUrl: function(json) {
    return Object.keys(json).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(json[k])
    }).join('&');
  },

  /**
   * ＵＲＬをＪＳＯＮに変換する
   * @param {String} url URL
   */
  urlToJson: function(url) {
    if (!url) {
      return {};
    }
    var hash;
    var json = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        json[hash[0]] = hash[1] === 'true' ? true : hash[1] === 'false' ? false : hash[1];
        // If you want to get in native datatypes
        // json[hash[0]] = JSON.parse(hash[1]); 
    }
    return json;
  },

  /**
   * Base64ファイルのサイズを取得（単位：バイト数）
   * @param {String} b64string Base64ファイルの文字列
   */
  getB64FileSize: function(b64string) {
    if (b64string && b64string.indexOf(";base64,") >= 0) {
      const arr = b64string.split(';base64,');
      const data = arr[1];
      return data.length * 3 / 4 - (data.match(/=/g) || []).length;
    } else {
      return 0;
    }
  },
};

export const table = {
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
    return filters;
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
};

