import React from "react";
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
  NativeSelect,
} from "@mui/material";
import { withStyles } from '@mui/styles';
import Autocomplete from '@mui/material/Autocomplete';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import formStyle from "../assets/css/form";
import HierarchySelect from './HierarchySelect';
import { common } from "../utils";

class ControlCreator extends React.Component {

  constructor(props) {
    super(props);

    this.setDatasource = this.setDatasource.bind(this);
    this.state = {
      datasource: null,
    };
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    const { type, variant, multiple } = this.props.column;
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
      const fileLabel = document.getElementById(`id_label_${this.props.column.name}`);
      if (multiple === true) {
        // ファイルが複数選択できる場合
        fileLabel.innerText = "";
        const blobFiles = [];
        for (const file of event.target.files) {
          const reader = new FileReader();
          reader.addEventListener('load', (e) => this.readMultiFileBlob(e, name, file.name, blobFiles));
          reader.readAsDataURL(file);
          fileLabel.innerText += file.name + ';';
        }
      } else {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (e) => this.readFileBlob(e, name, file.name));
        reader.readAsDataURL(file);
        fileLabel.innerText = file.name;
      }
      return;
    }

    if (this.props.handleChange) {
      this.props.handleChange(name, value, type)(event);
    }
  };

  handleChangeAutoComplete = (event, option) => {
    const { name, type } = this.props.column;
    if (this.props.handleChange) {
      if (option) {
        // 選択した場合
        this.props.handleChange(name, option.value, type)(event);
      } else {
        // 空白の場合
        this.props.handleChange(name, null, type)(event);
      }
    }
  }

  readFileBlob = (event, name, fileName) => {
    this.props.handleChange(
      name,
      `name:${btoa(unescape(encodeURIComponent(fileName)))};${event.target.result}`,
      'file'
    )(event);
  };

  readMultiFileBlob = (event, name, fileName, files) => {
    files.push(`name:${btoa(unescape(encodeURIComponent(fileName)))};${event.target.result}`);
    this.props.handleChange(
      name,
      files,
      'file'
    )(event);
  };

  handleBlur = (name) => (event) => {
    if (this.props.handleBlur) {
      this.props.handleBlur(event, name);
    }
  }

  setDatasource = (datasource) => {
    this.setState({datasource});
  };

  render() {
    const { classes, column, data, errors } = this.props;
    const { datasource } = this.state;
    let control = null;
    let { value } = this.props;
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
          variant="standard"
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
                <NativeSelect
                  value={value.toString()}
                  inputProps={{ name: column.name, value: value }}
                  onChange={this.handleChange}
                >
                  <option value={null}></option>
                  <option key='true' value='true'>はい</option>
                  <option key='false' value='false'>いいえ</option>
                </NativeSelect>
              ) : (
                <Select
                  value={value.toString()}
                  inputProps={{ name: column.name, value: value }}
                  onChange={this.handleChange}
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
                    onChange={this.handleChange}
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
              handleChange={this.handleChange}
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
              onChange={this.handleChangeAutoComplete}
              renderInput={params => (
                <TextField {...params} label={label} margin="normal" variant="standard" />
              )}
            />
            {column.help_text ? (
              <FormHelperText>{column.help_text}</FormHelperText>
            ) : null}
          </>
        );
      } else {
        const CtrlSelect = column.native === true ? NativeSelect : Select;
        control = (
          <React.Fragment>
            <InputLabel htmlFor={column.name}>{label}</InputLabel>
            <CtrlSelect
              value={value}
              inputProps={{ name: column.name, value: value }}
              onChange={this.handleChange}
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
            </CtrlSelect>
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
            onChange={this.handleChange}
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
          onChange={this.handleChange}
          variant="standard"
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
          onChange={this.handleChange}
          InputProps={{
            style: column.colStyles,
          }}
          variant="standard"
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
          onChange={this.handleChange}
          variant="standard"
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
          onChange={this.handleChange}
          variant="standard"
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
              onChange={this.handleChange}
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
          onChange={this.handleChange}
          onBlur={this.handleBlur(column.name)}
          variant="standard"
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
}

ControlCreator.propTypes = {
  classes: PropTypes.object.isRequired,
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

export default withStyles(formStyle)(ControlCreator);
