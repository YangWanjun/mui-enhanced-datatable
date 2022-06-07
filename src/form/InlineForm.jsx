import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Tooltip,
  IconButton,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { grey } from '@material-ui/core/colors';
import { common, form } from "../utils";
import { NonFieldErrors } from "../components";

const styles = () => ({
  inlineTable: {
    width: '100%',
  },
  alternativeInline: {
    backgroundColor: grey[100],
  },
  error: {
    color: 'red',
  },
});

class InlineForm extends React.Component {

  constructor(props) {
    super(props);

    this.handleAppendNew = this.handleAppendNew.bind();
    this.clean = this.clean.bind();
    this.state = {
      data: this.initializeData(props),
      errors: props.errors || {},
    };
  }

  initializeData(props) {
    if (props.schema) {
      let data = props.data || [];
      data.map(row => (
        props.schema.map(col => {
          if (common.isEmpty(row[col.name]) && col.default !== null && col.default !== undefined) {
            row[col.name] = col.default;
          }
          return true;
        })
      ))
      return data;
    } else {
      return [];
    }
  }

  handleDeleteInline = index => () => {
    let { data, errors } = this.state;
    data.splice(index, 1);
    if (errors) {
      // Indexによるエラーを順次移動する
      delete errors[index];
      Object.keys(errors).map(key => {
        if (key > index) {
          const existErrors = errors[key];
          delete errors[key];
          errors[key - 1] = existErrors;
        }
        return true;
      });
    }
    this.setState({data, errors});
  };

  handleAppendNew = () => {
    this.setState(state => {
      let data = state.data;
      data.push({is_new: true});
      return {data};
    });
  };

  handleChange = (prefix, inlineIndex) => (name, value, type) => (event) => {
    this.setState((state) => {
      let data = state.data.slice();
      data[inlineIndex][name] = value;
      return {data: data};
    });

    this.props.onChanges.map(method => {
      let data = this.state.data;
      data[inlineIndex][name] = value;
      const retVal = method(name, data, null, prefix, inlineIndex);
      if (retVal) {
        this.setState({data: retVal});
      }
      return true;
    });
  };

  createAddComponent = () => {
    return (
      <div>
        <Button fullWidth onClick={this.handleAppendNew}>
          <AddIcon />
        </Button>
      </div>
    );
  };

  validate = () => {
    const { schema, checkList } = this.props;
    const { data } = this.state;
    let errors = {};
    const valid = form.validate_form(data, schema, checkList, errors);

    const oldErrors = this.props.errors || {};
    errors = Object.assign(oldErrors, errors)
    this.setState({errors});
    return valid;
  };

  clean = () => {
    return form.clean_form(this.validate, this.state.data, this.props.schema);
  }

  render() {
    const { classes, schema, layout, allowAdd, allowDelete, new_line_schema } = this.props;
    const { data, errors } = this.state;
    const non_field_errors = errors ? errors.non_field_errors : null;

    if (Array.isArray(data) && data.length > 0) {
      return (
        <div>
          <NonFieldErrors errors={non_field_errors} />
          {data.map((row_data, key) => (
            <div key={key}className={key % 2 ? classes.alternativeInline : null}>
              <table className={classes.inlineTable}>
                <tbody>
                  <tr>
                    <td>
                      {form.createFormLayout(
                        row_data,
                        row_data.is_new === true ? new_line_schema : schema,
                        layout,
                        false,
                        true,
                        null,
                        key,
                        data,
                        errors[key],
                        this.handleChange
                      )}
                    </td>
                    { allowDelete !== false ? (
                      <td style={{width: 45}}>
                        <Tooltip title='削除' placement='bottom' enterDelay={300}>
                          <IconButton aria-label="Action" onClick={this.handleDeleteInline(key)}>
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </td>
                    ) : null }
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          { allowAdd !== false ? this.createAddComponent() : null }
        </div>
      );
    } else {
      return (
        <>
          { allowAdd !== false ? this.createAddComponent() : null }
        </>
      )
    }
  }
}

InlineForm.propTypes = {
  schema: PropTypes.array.isRequired,
  layout: PropTypes.array,
  data: PropTypes.array,
  onChanges: PropTypes.arrayOf(PropTypes.func),
  allowAdd: PropTypes.bool,
  allowDelete: PropTypes.bool,
};

InlineForm.defaultProps = {
  layout: [],
  data: [],
  onChanges: [],
  allowAdd: true,
  allowDelete: true,
};

export default withStyles(styles)(InlineForm);
