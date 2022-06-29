import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Chip,
  CircularProgress,
  Popper,
  Paper,
  ClickAwayListener,
  Collapse,
  makeStyles,
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { green } from '@material-ui/core/colors';
import { common, form, table } from "../utils";
import FormDialog from "../dialog/FormDialog";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { useIsWidthDown } from "../components";

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    minHeight: 48,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },

  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
  title: {
    flex: '0 0 auto',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  selected: {
    marginRight: theme.spacing(1),
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
  },
  filter: {
    padding: theme.spacing(3),
    width: 404,
    height: 'calc(100% - 250px)',
    overflowY: 'auto',
  },
}));

function DataTableToolbar(props) {
  const {
    onChangeFilter, id, title, tableHead, tableData, selected, tableActions, rowActions, saveCallback,
    addProps, editProps, showTitle, allowCsv,
    deleteProps, clearSelected, filterLayout,
  } = props;
  const [ openFilter, setOpenFilter ] = useState(false);
  const [ filters, setFilters ] = useState(props.filters);
  const [ btnLoadings, setBtnLoadings ] = useState({});
  const [ maxHeight, setMaxHeight ] = useState(300);
  const [ anchorEl, setAnchorEl ] = useState(null);
  const classes = useStyles();
  const refDelete = useRef(null)
  const refAdd = useRef(null);
  const refChange = useRef(null);

  useEffect(() => {
    setFilters(props.filters);
  }, [props.filters]);

  const onEscPress = (event) => {
    if(event.keyCode === 27) {
      //Do whatever when esc is pressed
      handleCloseFilter();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onEscPress, false);
    return () => {
      document.removeEventListener("keydown", onEscPress, false);
    }
  });

  const handleOpenFilter = (event) => {
    setOpenFilter(true);
    setAnchorEl(event.currentTarget);
    setMaxHeight(window.innerHeight - 300)
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleClearFilter = (event) => {
    Object.keys(filters).map(key => delete filters[key]);
    setFilters(filters);
    if (onChangeFilter) {
      onChangeFilter(event, filters);
    }
  }

  const handleDeleteFilter = name => (event) => {
    delete filters[name];
    if (onChangeFilter) {
      onChangeFilter(event, filters);
    }
  };

  const handleChange = (name, value, type) => (event) => {
    const column = common.getFromList(tableHead, 'name', name);
    let filter_in = null;
    if (!common.isEmpty(column.choices) && column.choices[0].hasOwnProperty('parent')) {
      filter_in = common.getChildren(value, column.choices, 'value', 'parent');
    }
    let _filters = Object.assign({}, filters);
    if (value === '' || value === null) {
      delete _filters[name];
    } else if (filter_in) {
      _filters[name] = {children: filter_in, value: value};
    } else {
      _filters[name] = value;
    }
    if (onChangeFilter) {
      onChangeFilter(event, _filters);
    }
    setFilters(_filters);
  };

  const createCsvAction = () => {
    return (
      <Tooltip title='ＣＳＶダウンロード' placement='bottom' enterDelay={300}>
        <IconButton
          aria-label="Action"
          onClick={() => common.downloadDataTableCSV(title, tableHead, tableData)}
        >
          <CloudDownloadIcon/>
        </IconButton>
      </Tooltip>
    );
  }

  const handleActionClick = (method, props, state_name) => {
    const _btnLoadings1 = Object.assign({}, btnLoadings);
    _btnLoadings1[state_name] = true;
    setBtnLoadings(_btnLoadings1);
    method(props).finally(() => {
      const _btnLoadings2 = Object.assign({}, btnLoadings);
      _btnLoadings2[state_name] = false;
      setBtnLoadings(_btnLoadings2);
    });
  }

  const createActions = () => {
    if (Array.isArray(selected) && selected.length > 0 ) {
      // 行ごとのアクション
      return (
        <React.Fragment>
          {rowActions.filter(act => act['visible'] !== false).map((action, key) => (
            <Tooltip
              key={key} 
              title={action.tooltip} 
              placement='bottom' 
              enterDelay={300}
            >
              <IconButton
                aria-label="Action"
                onClick={() => action.handleClick(
                  selected.length === 1 ? selected[0] : selected,
                  saveCallback
                )}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {tableActions.filter(act => act['visible'] !== false).map((action, key) => (
            <Tooltip
              key={key}
              title={action.tooltip}
              placement='bottom'
              enterDelay={300}
            >
              <IconButton
                aria-label="Action"
                className={classes.wrapper}
                onClick={
                  action.showLoading === true 
                    ? (props) => handleActionClick(() => action.handleClick(tableData, table.getParamFromFilter(filters)), props, `tbl_action_${key}`)
                    : () => action.handleClick(tableData, table.getParamFromFilter(filters))
                }
                disabled={btnLoadings[`tbl_action_${key}`] === true}
              >
                {action.icon}
                {action.showLoading === true ? (
                  btnLoadings[`tbl_action_${key}`] === true &&
                  <CircularProgress size={48} className={classes.buttonProgress} />
                ) : null}
              </IconButton>
            </Tooltip>
          ))}
        </React.Fragment>
      );
    }
  };

  const onShowAddDialog = () => {
    if (addProps.handleBeforeShowup) {
      addProps.handleBeforeShowup();
    }
    refAdd.current.handleOpen();
  };

  const onShowEditDialog = () => {
    if (editProps.handleBeforeShowup) {
      editProps.handleBeforeShowup(selected[0]);
    }
    refChange.current.handleOpen(selected[0]);
  };

  const onShowDeleteDialog = () => {
    refDelete.current.handleOpen();
  };

  const numSelected = selected.length;

  return (
    <div id={id}>
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <span color="inherit" className={classes.selected}>
              {numSelected} 件選択
            </span>
          ) : title && showTitle && common.isEmpty(filters) ? title : null }
          {Object.keys(filters).map(name => {
            let value = filters[name];
            if (value && value.value) {
              // 階層型のデータをフィルターの場合
              value = value.value;
            }
            const column = common.getFromList(tableHead, 'name', name);
            return (
              <Chip
                key={name}
                label={common.getLabelFromColumn(value, column)}
                className={classes.chip}
                onDelete={handleDeleteFilter(name)}
              />
            );
          })}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {createActions()}
          {(addProps && addProps.visible !== false && common.isEmpty(selected)) ? (
            <Tooltip title="追加" placement='bottom' enterDelay={300}>
              <IconButton aria-label="Add" onClick={onShowAddDialog}>
                <AddIcon color='secondary' />
              </IconButton>
            </Tooltip>
          ) : null}
          {(editProps
              && Array.isArray(selected) 
              && selected.length === 1 
              && (typeof(editProps.visible) === 'function' ? editProps.visible(selected[0]) : editProps.visible !== false)
          ) ? (
            <Tooltip title="変更" placement='bottom' enterDelay={300}>
              <IconButton aria-label="Edit" onClick={onShowEditDialog}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {(deleteProps
              && Array.isArray(selected) 
              && selected.length === 1 
              && (typeof(deleteProps.visible) === 'function' ? deleteProps.visible(selected[0]) : deleteProps.visible !== false)
          ) ? (
            <Tooltip title="削除" placement='bottom' enterDelay={300}>
              <IconButton aria-label="Delete" onClick={onShowDeleteDialog}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {allowCsv ? createCsvAction() : null}
          {!common.isEmpty(filters) ? (
            <Tooltip title="検索条件をクリア" placement='bottom' enterDelay={300}>
              <IconButton aria-label="ClearAll" onClick={handleClearFilter}>
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {tableHead.filter(col => col.searchable === true).length > 0 ? (
            useIsWidthDown('xs') ? (
              <Tooltip title="検索" placement='bottom' enterDelay={300}>
                { openFilter === true ? (
                  <IconButton aria-label="Filter list" onClick={handleCloseFilter}>
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton aria-label="Filter list" onClick={handleOpenFilter}>
                    <FilterListIcon />
                  </IconButton>
                )}
              </Tooltip>
            ) : (
              <ClickAwayListener onClickAway={handleCloseFilter}>
                <span>
                  <Tooltip title="検索" placement='bottom' enterDelay={300}>
                    <IconButton aria-label="Filter list" onClick={handleOpenFilter}>
                      <FilterListIcon />
                    </IconButton>
                  </Tooltip>
                  <Popper
                    open={openFilter}
                    transition
                    disablePortal
                    placement='bottom-end'
                    anchorEl={anchorEl}
                    style={{zIndex: 10}}
                  >
                    <Paper className={classes.filter} elevation={8} style={{maxHeight: maxHeight}}>
                      {form.createFormLayout(
                        filters,
                        tableHead.filter(col => col.searchable === true),
                        filterLayout,
                        true,  // isFloating
                        false,  // isSingleLine
                        null,
                        null,
                        null,
                        null,
                        () => handleChange,
                        null,
                      )}
                    </Paper>
                  </Popper>
                </span>
              </ClickAwayListener>
            )
          ) : null}
        </div>
      </Toolbar>
      { useIsWidthDown('xs') ? (
        <div>
          <Collapse in={openFilter} timeout='auto' unmountOnExit>
            {form.createFormLayout(
              filters,
              tableHead.filter(col => col.searchable === true),
              filterLayout,
              true,  // isFloating
              false,
              null,
              null,
              null,
              null,
              () => handleChange,
              null,
            )}
          </Collapse>
        </div>
      ) : null}
      {/* 追加ダイアログ */}
      {(addProps && addProps.visible !== false && common.isEmpty(selected)) ? (
        <FormDialog
          title={`${title}を追加`}
          ref={refAdd}
          {...addProps}
        />
      ) : null}
      {/* 変更ダイアログ */}
      {(editProps && editProps.visible !== false && Array.isArray(selected) && selected.length === 1) ? (
        <FormDialog
          title={`${title}を変更`}
          ref={refChange}
          {...editProps}
          saveCallback={saveCallback}
        />
      ) : null}
      {/* 削除ダイアログ */}
      {(deleteProps && deleteProps.visible !== false && Array.isArray(selected) && selected.length === 1) ? (
        <ConfirmDialog
          title='削除'
          ref={refDelete}
          onOk={() => {
            return deleteProps.handleDelete(selected[0])
              .then(() => {
                // setTimeoutしないと、選択レコード消したら、ConfirmDialogは勝てに消えるので、
                // その後ConfirmDialog.handleCloseを呼び出したら、エラーになってします。
                setTimeout(clearSelected, 100);
              })
          }}
        />
      ) : null}
    </div>
  );
}

DataTableToolbar.propTypes = {
  showTitle: PropTypes.bool,
  filters: PropTypes.object,
  filterLayout: PropTypes.array,
  addProps: PropTypes.shape({
    title: PropTypes.string,
    schema: PropTypes.array.isRequired,
    handleOk: PropTypes.func.isRequired,
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  }),
  editProps: PropTypes.shape({
    title: PropTypes.string,
    schema: PropTypes.array.isRequired,
    handleOk: PropTypes.func.isRequired,
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  }),
  saveCallback: PropTypes.func,
  deleteProps: PropTypes.shape({
    handleDelete: PropTypes.func.isRequired,
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  }),
};
DataTableToolbar.defaultProps = {
  showTitle: true,
  filters: {},
  addProps: null,
  editProps: null,
  deleteProps: null,
};

export default DataTableToolbar;
