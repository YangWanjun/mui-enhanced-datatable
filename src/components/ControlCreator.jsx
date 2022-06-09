import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  TextField,
  Select,
  Checkbox,
  MenuItem,
  Button,
  IconButton,
  Chip,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import formStyle from "../assets/css/form";
import HierarchySelect from './HierarchySelect';
import { common } from "../utils";

const useStyles = makeStyles(formStyle);

function ControlCreator(props) {
  const [ datasource, setDatasource ] = useState(null);
  const { column, data, errors, handleChange, handleBlur } = props;
  const classes = useStyles();
  
  const handleInnerChange = (event) => {
    let { name, value } = event.target;
    const { type, variant, multiple } = column;
    if (type === 'boolean') {
      if (variant !== 'select') {
        // チェックボックスの場合
        name = event.target.value;
        value = event.target.checked;
      } else {
        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }
      }
    } else if (type === 'integer') {
      value = common.toInteger(value);
    } else if (type === 'file') {
      const fileLabel = document.getElementById(`id_label_${column.name}`);
      if (multiple === true) {
        // ファイルが複数選択できる場合
        fileLabel.innerText = "";
        const blobFiles = [];
        for (const file of event.target.files) {
          const reader = new FileReader();
          reader.addEventListener('load', (e) => readMultiFileBlob(e, name, file.name, blobFiles));
          reader.readAsDataURL(file);
          fileLabel.innerText += file.name + ';';
        }
      } else {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (e) => readFileBlob(e, name, file.name));
        reader.readAsDataURL(file);
        fileLabel.innerText = file.name;
      }
      return;
    }

    if (handleChange) {
      handleChange(name, value, type)(event);
    }
  };

  const handleChangeAutoComplete = (event, option) => {
    const { name, type } = column;
    if (handleChange) {
      if (option) {
        // 選択した場合
        handleChange(name, option.value, type)(event);
      } else {
        // 空白の場合
        handleChange(name, null, type)(event);
      }
    }
  }

  const readFileBlob = (event, name, fileName) => {
    handleChange(
      name,
      `name:${btoa(unescape(encodeURIComponent(fileName)))};${event.target.result}`,
      'file'
    )(event);
  };

  const readMultiFileBlob = (event, name, fileName, files) => {
    files.push(`name:${btoa(unescape(encodeURIComponent(fileName)))};${event.target.result}`);
    handleChange(
      name,
      files,
      'file'
    )(event);
  };

  const handleInnerBlur = (name) => (event) => {
    if (handleBlur) {
      handleBlur(event, name);
    }
  }

  let control = null;
  let { value } = props;
  const label = column.required === true ? (
    <span>
      {column.label}
      <span className={classes.required}>（＊）</span>
    </span>
  ) : (
    <span>{column.label}</span>
  );
  value = (value === null || value === undefined) ? '' : value;
  const error = Array.isArray(errors) && errors.length > 0;
  const errorNodes = (
    error === true ? (
      <React.Fragment>
        {errors.map((message, key) => <FormHelperText key={key}>{message}</FormHelperText>)}
      </React.Fragment>
    ) : null
  );
  let placeholderProps = null;
  if (column.help_text) {
    placeholderProps = {
      placeholder: column.help_text,
      InputLabelProps: { shrink: true,},
    };
  }

  if (column.read_only === true) {
    control = (
      <TextField
        disabled
        error={error}
        name={column.name}
        value={column.type === 'choice' ? common.getDisplayNameFromChoice(value, column) : value}
        label={column.label + (column.required === true ? '(＊)' : '')}
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  } else if (column.type === 'boolean') {
    // チェックボックスを表示
    control = (
      <React.Fragment>
        { column.variant === 'select' ? (
          <React.Fragment>
            <InputLabel htmlFor={column.name}>{label}</InputLabel>
            {column.native === true ? (
              <Select
                native
                value={value.toString()}
                inputProps={{ name: column.name, value: value }}
                onChange={handleInnerChange}
              >
                <option value={null}></option>
                <option key='true' value='true'>はい</option>
                <option key='false' value='false'>いいえ</option>
              </Select>
            ) : (
              <Select
                value={value.toString()}
                inputProps={{ name: column.name, value: value }}
                onChange={handleInnerChange}
              >
                <MenuItem value={null}><em>None</em></MenuItem>
                <MenuItem key='true' value='true'>はい</MenuItem>
                <MenuItem key='false' value='false'>いいえ</MenuItem>
              </Select>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value = value === true ? true : false} 
                  value={column.name} 
                  onChange={handleInnerChange}
                />
              }
              label={label}
            />
          </React.Fragment>
        ) }
        {column.help_text ? (
          <FormHelperText>{column.help_text}</FormHelperText>
        ) : null}
      </React.Fragment>
    );
  } else if (column.type === 'choice') {
    // 選択肢が存在する場合
    const choices = Array.isArray(datasource) ? datasource : (column.choices || []);
    column['choices'] = choices;
    if (!common.isEmpty(column.choices) && column.choices[0].hasOwnProperty('parent')) {
      control = (
        <React.Fragment>
          <HierarchySelect
            native={column.native === true}
            name={column.name}
            label={label}
            value={value}
            error={error}
            choices={choices}
            handleChange={handleInnerChange}
          />
          {column.help_text ? (
            <FormHelperText>{column.help_text}</FormHelperText>
          ) : null}
        </React.Fragment>
      );
    } else if (column.variant === 'autocomplete') {
      control = (
        <>
          <Autocomplete
            className={classes.autoCompleteWrapper}
            value={common.getFromList(choices, 'value', value)}
            options={choices}
            getOptionLabel={option => option.display_name || ''}
            getOptionDisabled={(option) => option.disabled === true}
            onChange={handleChangeAutoComplete}
            renderInput={params => (
              <TextField {...params} label={label} margin="normal" />
            )}
          />
          {column.help_text ? (
            <FormHelperText>{column.help_text}</FormHelperText>
          ) : null}
        </>
      );
    } else {
      control = (
        <React.Fragment>
          <InputLabel htmlFor={column.name}>{label}</InputLabel>
          <Select
            native={column.native === true}
            value={value}
            inputProps={{ name: column.name, value: value }}
            onChange={handleInnerChange}
          >
            {column.native === true ? <option value={null}></option> : <MenuItem value={null}><em>None</em></MenuItem>}
            {column.native === true ? (
              choices.map(item => {
                return (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.display_name}
                  </option>
                );
              })
            ) : (
              choices.map(item => {
                return (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                  >
                    {item.display_name}
                  </MenuItem>
                );
              })
            )}
          </Select>
          {column.help_text ? (
            <FormHelperText>{column.help_text}</FormHelperText>
          ) : null}
        </React.Fragment>
      );
    }
  } else if (column.type === 'choices') {
    value = value || [];
    control = (
      <React.Fragment>
        <InputLabel htmlFor={column.name}>{label}</InputLabel>
        <Select
          multiple
          value={value}
          inputProps={{ name: column.name, value: value }}
          onChange={handleInnerChange}
          renderValue={selected => (
            <div>
              {selected.map(value => (
                <Chip key={value} label={common.getFromList(column.choices, 'value', value).display_name} />
              ))}
            </div>
          )}
        >
          {column.choices && column.choices.map(item => {
            return (
              <MenuItem key={item.value} value={item.value}>
                <Checkbox checked={value.indexOf(item.value) > -1} />
                <ListItemText primary={item.display_name} />
              </MenuItem>
            );
          })}
        </Select>
        {column.help_text ? (
          <FormHelperText>{column.help_text}</FormHelperText>
        ) : null }
      </React.Fragment>
    );
  } else if (column.type === 'date') {
    control = (
      <TextField
        error={error}
        name={column.name}
        value={value}
        label={label}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleInnerChange}
      />
    );
  } else if (column.type === 'text') {
    control = (
      <TextField
        error={error}
        multiline
        name={column.name}
        value={value}
        label={label}
        {...placeholderProps}
        onChange={handleInnerChange}
        InputProps={{
          style: column.colStyles,
        }}
      />
    );
  } else if (column.type === 'integer') {
    control = (
      <TextField
        error={error}
        name={column.name}
        type='number'
        value={value}
        label={label}
        inputProps={{min: column.min_value, max: column.max_value, step: column.step || 1}}
        {...placeholderProps}
        onChange={handleInnerChange}
      />
    );
  } else if (column.type === 'decimal') {
    control = (
      <TextField
        error={error}
        name={column.name}
        type='number'
        value={value}
        label={label}
        inputProps={{min: column.min_value, max: column.max_value, step: column.step}}
        {...placeholderProps}
        onChange={handleInnerChange}
      />
    );
  } else if (column.type === 'file') {
    control = (
      <div className={classes.fileWrapper}>
        <label htmlFor={`id_${column.name}`}>
          <Button variant='outlined' component='span'>
            {label || 'ファイルを選択'}
          </Button>
          <input
            type="file"
            name={column.name}
            multiple={column.multiple === true}
            id={`id_${column.name}`}
            className={classes.inputFileBtnHide}
            onChange={handleInnerChange}
          />
        </label>
        <label
          htmlFor={`id_${column.name}`}
          className={classes.fileNameWrapper}
          id={`id_label_${column.name}`}
        >
          {data[column.verbose_name] || '選択されていません。'}
        </label>
        {data[column.verbose_name] ? (
          <span className={classes.fileDownloadWrapper}>
            <IconButton
              className={classes.fileDownloadIcon}
              onClick={() => column.handle_download(value)}
            >
              <ImageSearchIcon />
            </IconButton>
          </span>
        ) : null}
      </div>
    );
  } else {
    control = (
      <TextField 
        error={error}
        name={column.name}
        label={label}
        value={value}
        {...placeholderProps}
        inputProps={{maxLength: column.max_length}}
        onChange={handleInnerChange}
        onBlur={handleInnerBlur(column.name)}
      />
    );
  }

  return (
    <FormControl className={classes.formControl} error={error}>
      {control}
      {errorNodes}
    </FormControl>
  );
}

ControlCreator.propTypes = {
  column: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.any,
  data: PropTypes.object,
  errors: PropTypes.arrayOf(PropTypes.string),
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
};

ControlCreator.defaultProps = {
  errors: [],
};

export default ControlCreator;
