import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
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
import HistoryIcon from '@material-ui/icons/History';
import HistoryDialog from "../dialog/HistoryDialog";
import { common, table } from "../utils";

function DataTableCell(props) {
  const { classes, column, data, actions, actionsTrigger, histories } = props;
  const [ open, setOpen ] = useState(false);
  const refHistoryDialog = useRef(null);

  const getOutput = (value) => {
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

  const handleShowActions = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  const handleHideActions = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setOpen(false);
  };

  const handleFileDownload = file_id => (event) => {
    event.stopPropagation();
    if (column.handle_download) {
      column.handle_download(file_id, data);
    }
  }

  const handleActionClick = (method) => (event) =>  {
    event.stopPropagation();
    if (method) {
      method(data);
    }
  };

  const showHistories = () => {
    if (Array.isArray(histories) && histories.length > 0 && refHistoryDialog.current) {
      refHistoryDialog.current.handleOpen(histories);
    }
  }

  let value = data[column.name];
  if (column.get_value && typeof column.get_value === 'function') {
    value = column.get_value(value, data);
  }

  let style = Object.assign({}, props.style);
  let attrs = { 'align': table.getCellAlignment(column.type).align };
  let output = null;
  if (Array.isArray(actions) && actions.length > 0 && (!actionsTrigger || actionsTrigger(data))) {
    style['padding'] = 0;
    style['width'] = 35;
    style['position'] = 'relative';
    attrs['align'] = 'center';
    output = (
      <React.Fragment>
        {open ? (
          <IconButton style={{padding: 10}} onClick={handleHideActions}>
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton style={{padding: 10}} onClick={handleShowActions}>
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
                        onClick={handleActionClick(action.handleClick)}
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
    output = getOutput(value);
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
      <IconButton onClick={handleFileDownload(value)} style={{padding: 10}}>
        <ArchiveIcon />
      </IconButton>
    ) : null);
  } else if (column.type === 'choice') {
    const display_name = common.getDisplayNameFromChoice(value, column);
    output = getOutput(display_name);
  } else if (column.type === 'text') {
    output = common.getColumnDisplay(value, column);
  } else {
    output = getOutput(value);
  }

  return column.visible === false ? null : (
    <TableCell className={classes.tableCell} key={uuidv4()} style={style} {...attrs}>
      {column.max_width ? (
        <div style={{ maxWidth: column.max_width, }} className={classes.tableCellFixedWidth} title={value}>
          {output}
        </div>
      ) : output }
      { histories.length > 0 ? (
        <IconButton
          color="primary"
          size="small"
          className={classes.historyIcon}
          onClick={showHistories}
        >
          <HistoryIcon />
        </IconButton>
      ) : null }
      <HistoryDialog
        ref={refHistoryDialog}
      />
    </TableCell>
  );
}

DataTableCell.defaultProps = {
  column: {},
  data: {},
  actions: [],
  histories: [],
};

DataTableCell.propTypes = {
  classes: PropTypes.object.isRequired,
  column: PropTypes.object,
  data: PropTypes.object,
  actions: PropTypes.array,
  actionsTrigger: PropTypes.func,
  style: PropTypes.object,
  histories: PropTypes.array,
};

export default DataTableCell;
