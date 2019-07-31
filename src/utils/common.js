import { vsprintf } from 'sprintf-js';

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
    }
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
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
    Object.keys(filters).map( key => {
      array = array.filter(function(item) {
        let item_value = item[key];
        if (item_value === true || item_value === false) {
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
      ? (a, b) => (b[orderBy] - a[orderBy])
      : (a, b) => (a[orderBy] - b[orderBy]);
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
    let {left, width, top, height} = srcTable.getBoundingClientRect();
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
    tableHead = tableHead.filter(col => col.visible !== false);
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
      let line = infoArray.join(",");
      lineArray.push(line);
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
  loadFilters: function(location) {
    if (location && location.search) {
      let json = common.urlToJson(location.search);
      Object.keys(json).map(key => {
        if (key.slice(0, 2) === '__') {
          delete json[key];
        }
        return true;
      });
      return json;
    } else {
      return {};
    }
  }
};
