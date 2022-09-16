import React from "react";
import {
  Grid,
} from '@material-ui/core';
import { ControlCreator } from '../components';
import common from './common';
import constant from './constant';

const getColspanArray = (schema, isSingleLine) => {
  let arr = new Array(schema.length);
  if (isSingleLine === true) {
    const avgSpan = Math.floor(12 / schema.length);
    if (avgSpan > 0) {
      schema.map((c, index) => (arr[index] = avgSpan));
      arr[schema.length - 1] = 12 - ((schema.length - 1) * avgSpan);
    }
  } else {
    schema.map((c, index) => (arr[index] = 12));
  }
  return arr;
};

/**
 * 
 * @param {*} data 
 * @param {*} schema 
 * @param {*} layout 
 * @param {Boolean} isFloating true:フォームはPopperとして表示する場合 selectが存在したら、native属性をtrueに設定する必要です。
 * @param {*} isSingleLine 
 * @param {*} prefix 
 * @param {*} inlineIndex 
 * @param {*} inlineDataList 
 * @param {*} errors 
 * @param {*} handleChange 
 * @param {*} handleBlur 
 */
export const createFormLayout = (data, schema, layout, isFloating, isSingleLine, prefix, inlineIndex, inlineDataList, errors, handleChange, handleBlur) => {
  let control = null;
  if (common.isEmpty(layout)) {
    const colspanArr = getColspanArray(schema, isSingleLine);
    control = (
      <Grid container>
        {schema.map((col, key) => {
          col.native = isFloating;
          return createFormField(col, key, colspanArr[key], data, prefix, inlineIndex, inlineDataList, errors, handleChange, handleBlur);
        })}
      </Grid>
    );
  } else {
    control = (
      <Grid container>
        {layout.map((row, key) => (
          createRowLayout(row, key, data, prefix, inlineIndex, inlineDataList, schema, errors, isFloating, handleChange, handleBlur)
        ))}
      </Grid>
    );
  }
  return control;
};

export const createRowLayout = (row, key, data, prefix, inlineIndex, inlineDataList, schema, errors, isFloating, handleChange, handleBlur) => {
  if (typeof row === 'string') {
    const col = common.getFromList(schema, 'name', row);
    col.native = isFloating;
    return col && !common.isEmpty(col) ? createFormField(col, row, 12, data, prefix, inlineIndex, inlineDataList, errors, handleChange, handleBlur) : null;
  } else if (Array.isArray(row)) {
    const colSpan = Math.floor(12 / row.length);
    return (
      <React.Fragment key={key}>
        {row.map((fieldName, key) => {
          const col = common.getFromList(schema, 'name', fieldName);
          col.native = isFloating;
          return col && !common.isEmpty(col) ? createFormField(col, key, colSpan, data, prefix, inlineIndex, inlineDataList, errors, handleChange, handleBlur) : null;
        })}
      </React.Fragment>
    );
  }
  return null;
};

export const createFormField = (col, key, colSpan, data, prefix, inlineIndex, inlineDataList, errors, handleChange, handleBlur) => {
  let fieldErrors = null;
  if (errors) {
    fieldErrors = errors[col.name];
  }
  if (col.type === 'cascade') {
    return (
      <ControlCreator
        key={key}
        column={col}
        data={data}
        handleChange={handleChange(inlineIndex)}
        wrapper={{element: Grid, props: {xs: 12, sm: 12, md: colSpan, item: true}}}
        errors={fieldErrors}
      />
    );
  } else {
    const choices = data[col.name + '_choices'];
    let value = data[col.name];
    if (value && Object.prototype.hasOwnProperty.call(value, "value")) {
      // 階層型のデータをフィルターの場合
      value = value.value;
    }
    if (col.type === 'choices' && choices) {
      // 複数選択時、選択肢はデータから取得する場合
      col['choices'] = choices;
      if (common.isEmpty(choices)) {
        value = null;
        data[col.name] = null;
      }
    }
    let newCol = col;
    if (col.get_props && typeof col.get_props === 'function') {
      newCol = Object.assign({}, col, col.get_props(data, inlineDataList));
    }
    return (
      <Grid item key={key} xs={12} sm={12} md={colSpan}>
        <ControlCreator
          column={newCol} 
          value={value}
          data={data}
          errors={fieldErrors}
          handleBlur={handleBlur}
          handleChange={handleChange(prefix, inlineIndex)}
          ref={(ctrl) => {
            if (col.cascade_from && ctrl && ctrl.setDatasource) {
              col['cascade_reflect'] = ctrl.setDatasource;
            }
          }}
        />
      </Grid>
    );
  }
};

export const validate_form = (data, schema, checkList, errors) => {
  let valid = true;
  // 項目の定義からチェック
  if (validate_by_schema(null, schema, data, errors) === false) {
    valid = false;
  }
  // カスタマイズのチェック
  if (valid === true) {
    (checkList || []).map(method => {
      const retVal = method(data);
      if (retVal !== true) {
        valid = false;
        retVal.map(item => (
          pushError(null, item.index, item.name, item.message, errors)
        ));
      }
      return true;
    });
  }

  return valid;
};

export const validate_by_schema = (prefix, schema, data, errors) => {
  let valid = true;
  let dataList = null;
  let isInline = prefix ? true : false;
  if (data === undefined || data === null) {
    dataList = [];
  } else if (Array.isArray(data)) {
    dataList = data;
    isInline = true;
  } else {
    dataList = [data];
  }
  dataList.map((formData, key) => {
    schema.map(col => {
      const name = col.name;
      const value = formData[name];
      const index = isInline ? key : null;
      if (col.required === true) {
        // 必須項目チェック
        if (value === null || value === '' || value === undefined || (typeof value === 'object' && common.isEmpty(value))) {
          valid = false;
          pushError(prefix, index, name, common.formatStr(constant.ERROR.REQUIRE_FIELD, {name: col.label}), errors);
        }
      }
      if (value && col.regex) {
        // 正規表現チェック
        const regex = new RegExp(col.regex);
        if (regex.test(value) === false) {
          valid = false;
          pushError(prefix, index, name, constant.ERROR.INVALID_DATA, errors);
        }
      }
      if (col.type === 'file' && col.limit) {
        const fileSize = common.getB64FileSize(value);
        if (fileSize > 0 && fileSize > col.limit) {
          valid = false;
          pushError(prefix, index, name, common.formatStr(constant.ERROR.FILE_SIZE_LIMIT, {limit: col.limit / 1024 / 1024 + 'MB'}), errors);
        }
      }
      return true;
    });
    return true;
  })
  return valid;
};

export const pushError = (prefix, index, name, error, errors) => {
  let newErrors = errors;
  if (prefix && index !== undefined && index !== null) {
    let inlineErrors = {};
    if (prefix in errors) {
      inlineErrors = errors[prefix];
    } else {
      inlineErrors = {};
      errors[prefix] = inlineErrors;
    }
    if (index in inlineErrors) {
      newErrors = inlineErrors[index];
    } else {
      newErrors = {};
      inlineErrors[index] = newErrors;
    }
  } else if (index !== undefined && index !== null) {
    if (index in errors) {
      newErrors = errors[index];
    } else {
      newErrors = {};
      errors[index] = newErrors;
    }
  }
  if (name in newErrors) {
    newErrors[name].push(error);
  } else {
    newErrors[name] = [error];
  }
};

export const clean_form = (validateFunc, formData, schema) => {
  if (validateFunc() === true) {
    let data = null;
    if (Array.isArray(formData)) {
      data = formData.slice();
    } else {
      data = Object.assign({}, formData);
      schema.map(col => {
        if (col.type === 'field') {
          const value = data[col.name];
          if (Array.isArray(value) && value.length > 0) {
            const item = value[0];
            data[col.name] = item.value;
          }
        } else if (col.type === 'fields') {
          const value = data[col.name];
          if (Array.isArray(value) && value.length > 0) {
            let items = [];
            value.map(item => (items.push(item.value)))
            data[col.name] = items;
          }
        }
        return true;
      });
    }
    return data;
  } else {
    return null;
  }
};

export default {
  createFormLayout,
  createRowLayout,
  createFormField,
  validate_form,
  validate_by_schema,
  pushError,
  clean_form,
};
