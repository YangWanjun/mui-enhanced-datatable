import React from "react";
import uuid from 'uuid';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import {
  TableCell,
  IconButton,
  Grow,
  Button,
  Tooltip,
  Fab,
} from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ArchiveIcon from '@material-ui/icons/Archive';
import { common } from "../utils/common";
import { getCellAlignment } from "./Common";

class DataTableCell extends React.Component {

  constructor(props) {
    super(props);

    this.handleHideActions = this.handleHideActions.bind(this);
    this.state = {
      open: false,
    }
  }

  getOutput(value) {
    const { column, data } = this.props;
    let url = null;
    if (column.link) {
      if (typeof column.link === 'string') {
        url = common.formatStr(column.link, data);
      } else if (typeof column.link === 'function') {
        url = common.formatStr(column.link(data), data);
      }
    }

    return (
      url ? (
        <Link to={url}>{value}</Link>
      ) : value
    );
  }

  handleShowActions = (event) => {
    event.stopPropagation();
    this.setState({open: true});
  };

  handleHideActions = (event) => {
    if (event) {
      event.stopPropagation();
    }
    this.setState({open: false});
  };

  handleFileDownload = file_id => (event) => {
    const { column, data } = this.props;
    event.stopPropagation();
    if (column.handle_download) {
      column.handle_download(file_id, data);
    }
  }

  handleActionClick = (method) => (event) =>  {
    event.stopPropagation();
    const { data } = this.props;
    if (method) {
      method(data);
    }
  };

  render() {
    const { classes, column, data, actions, actionsTrigger } = this.props;
    const { open } = this.state;
    let value = data[column.name];
    if (column.get_value && typeof column.get_value === 'function') {
      value = column.get_value(value, data);
    }

    let style = Object.assign({}, this.props.style);
    let attrs = { 'align': getCellAlignment(column.type).align };
    let output = null;
    if (Array.isArray(actions) && actions.length > 0 && (!actionsTrigger || actionsTrigger(data))) {
      style['padding'] = 0;
      style['width'] = 35;
      style['position'] = 'relative';
      attrs['align'] = 'center';
      output = (
        <React.Fragment>
          {open ? (
            <IconButton style={{padding: 10}} onClick={this.handleHideActions}>
              <CloseIcon />
            </IconButton>
          ) : (
            <IconButton style={{padding: 10}} onClick={this.handleShowActions}>
              <MoreVertIcon />
            </IconButton>
          )}
          <div className={classes.tableActionWrapper}>
            <Grow in={open}>
              <div style={{display: open ? 'block' : 'none'}}>
                {actions.map((action, key) => {
                  if (action.trigger && !action.trigger(data)) {
                    return null;
                  } else if (action.icon) {
                    return (
                      <Tooltip key={key} title={action.tooltip} placement='bottom' enterDelay={300}>
                        <Fab
                          size="medium"
                          color={action.color ? action.color : "primary"}
                          aria-label="Add"
                          onClick={this.handleActionClick(action.handleClick)}
                          className={classes.tableActionButton}
                        >
                          {action.icon}
                        </Fab>
                      </Tooltip>
                    );
                  } else {
                    return (
                      <Button
                        key={key}
                        variant="contained"
                        color={action.color ? action.color : "primary"}
                        className={classes.button}
                      >
                        {action.name}
                      </Button>
                    );
                  }
                })}
              </div>
            </Grow>
          </div>
        </React.Fragment>
      );
    } else if (column.type === 'integer' || column.type === 'decimal') {
      // 数字の場合右揃え、カンマ区切り表示
      value = common.toNumComma(value);
      output = this.getOutput(value);
    } else if (column.type === 'percent') {
      output = common.getColumnDisplay(value, column);
    } else if (column.type === 'boolean') {
      style['padding'] = 0;
      if (value === true || value === 1) {
        output = <CheckCircleIcon style={{color: 'green'}} />;
      } else if (value === false || value === 0) {
        output = <HighlightOffIcon style={{color: 'red'}} />;
      }
    } else if (column.type === 'file') {
      style['padding'] = 0;
      output = (value ? (
        <IconButton onClick={this.handleFileDownload(value)} style={{padding: 10}}>
          <ArchiveIcon />
        </IconButton>
      ) : null);
    } else if (column.type === 'choice') {
      const display_name = common.getDisplayNameFromChoice(value, column);
      output = this.getOutput(display_name);
    } else if (column.type === 'text') {
      output = common.getColumnDisplay(value, column);
    } else {
      output = this.getOutput(value);
    }

    return column.visible === false ? null : (
      <TableCell className={classes.tableCell} key={uuid()} style={style} {...attrs}>
        {column.max_width ? (
          <div style={{ maxWidth: column.max_width, }} className={classes.tableCellFixedWidth} title={value}>
            {output}
          </div>
        ) : output }
      </TableCell>
    );
  }
}

DataTableCell.defaultProps = {
  column: {},
  data: {},
  actions: [],
};

DataTableCell.propTypes = {
  classes: PropTypes.object.isRequired,
  column: PropTypes.object,
  data: PropTypes.object,
  actions: PropTypes.array,
};

export default DataTableCell;
