import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Toolbar,
  Tooltip,
  IconButton,
  Chip,
  CircularProgress,
  Popper,
  Paper,
  ClickAwayListener,
  withWidth,
  isWidthDown,
  Collapse,
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
import { createFormLayout } from "../form/common";
import { common } from "../utils/common";
import FormDialog from "../dialog/FormDialog";
import ConfirmDialog from "../dialog/ConfirmDialog";

const styles = theme => ({
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
});

class DataTableToolbar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openFilter: false,
      anchorEl: null,
      filters: props.filters,
      btnLoadings: {},
      maxHeight: 300,
    };
  }

  onEscPress = (event) => {
    if(event.keyCode === 27) {
      //Do whatever when esc is pressed
      this.handleCloseFilter();
    }
  };

  componentDidMount = () => {
    document.addEventListener("keydown", this.onEscPress, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.onEscPress, false);
  };

  handleOpenFilter = (event) => {
    this.setState({ openFilter: true, anchorEl: event.currentTarget, maxHeight: window.innerHeight - 300 });
  };

  handleCloseFilter = () => {
    this.setState({ openFilter: false });
  };

  handleClearFilter = (event) => {
    const { filters } = this.state;
    Object.keys(filters).map(key => delete filters[key]);
    this.setState({ filters: filters });
    if (this.props.onChangeFilter) {
      this.props.onChangeFilter(event, filters);
    }
  }

  handleDeleteFilter = name => (event) => {
    const { filters } = this.state;
    delete filters[name];
    if (this.props.onChangeFilter) {
      this.props.onChangeFilter(event, filters);
    }
  };

  handleChange = (name, value, type) => (event) => {
    const { tableHead } = this.props;
    const column = common.getFromList(tableHead, 'name', name);
    let filter_in = null;
    if (!common.isEmpty(column.choices) && column.choices[0].hasOwnProperty('parent')) {
      filter_in = common.getChildren(value, column.choices, 'value', 'parent');
    }
    this.setState((state) => {
      let filters = state.filters;
      if (value === '' || value === null) {
        delete filters[name];
      } else if (filter_in) {
        filters[name] = {children: filter_in, value: value};
      } else {
        filters[name] = value;
      }
      if (this.props.onChangeFilter) {
        this.props.onChangeFilter(event, filters);
      }
      return {filters: filters};
    });
  };

  createCsvAction = () => {
    const { title, tableHead, tableData } = this.props;
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

  handleActionClick = (method, props, state_name) => {
    this.setState(state => {
      const btnLoadings = state.btnLoadings;
      btnLoadings[state_name] = true;
      return Object.assign({}, btnLoadings);
    });
    method(props).finally(() => (
      this.setState(state => {
        const btnLoadings = state.btnLoadings;
        btnLoadings[state_name] = false;
        return Object.assign({}, btnLoadings);
      })
    ));
  }

  createActions = () => {
    const { classes, selected, tableData, tableActions, rowActions, saveCallback } = this.props;
    const { btnLoadings } = this.state;

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
                    ? (props) => this.handleActionClick(() => action.handleClick(tableData), props, `tbl_action_${key}`)
                    : () => action.handleClick(tableData)
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

  onShowAddDialog = () => {
    if (this._showAddDialog) {
      const { addProps } = this.props;
      if (addProps.handleBeforeShowup) {
        addProps.handleBeforeShowup();
      }
      this._showAddDialog();
    }
  };

  onShowEditDialog = () => {
    const { selected, editProps } = this.props;
    if (this._showModel) {
      if (editProps.handleBeforeShowup) {
        editProps.handleBeforeShowup(selected[0]);
      }
      this._showModel(selected[0]);
    }
  };

  onShowDeleteDialog = () => {
    if (this._showDeleteConfirm) {
      this._showDeleteConfirm();
    }
  };

  render() {
    const {
      classes, id, title, showTitle, tableHead, selected, allowCsv,
      addProps, editProps, saveCallback, deleteProps, clearSelected, filterLayout, width,
    } = this.props;
    const { filters, openFilter, anchorEl, maxHeight } = this.state;
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
                  onDelete={this.handleDeleteFilter(name)}
                />
              );
            })}
          </div>
          <div className={classes.spacer} />
          <div className={classes.actions}>
            {this.createActions()}
            {(addProps && addProps.visible !== false && common.isEmpty(selected)) ? (
              <Tooltip title="追加" placement='bottom' enterDelay={300}>
                <IconButton aria-label="Add" onClick={this.onShowAddDialog}>
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
                <IconButton aria-label="Edit" onClick={this.onShowEditDialog}>
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
                <IconButton aria-label="Delete" onClick={this.onShowDeleteDialog}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            {allowCsv ? this.createCsvAction() : null}
            {!common.isEmpty(filters) ? (
              <Tooltip title="検索条件をクリア" placement='bottom' enterDelay={300}>
                <IconButton aria-label="ClearAll" onClick={this.handleClearFilter}>
                  <ClearAllIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            {tableHead.filter(col => col.searchable === true).length > 0 ? (
              isWidthDown('xs', width) ? (
                <Tooltip title="検索" placement='bottom' enterDelay={300}>
                  { openFilter === true ? (
                    <IconButton aria-label="Filter list" onClick={this.handleCloseFilter}>
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    <IconButton aria-label="Filter list" onClick={this.handleOpenFilter}>
                      <FilterListIcon />
                    </IconButton>
                  )}
                </Tooltip>
              ) : (
                <ClickAwayListener onClickAway={this.handleCloseFilter}>
                  <span>
                    <Tooltip title="検索" placement='bottom' enterDelay={300}>
                      <IconButton aria-label="Filter list" onClick={this.handleOpenFilter}>
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
                        {createFormLayout(
                          filters,
                          tableHead.filter(col => col.searchable === true),
                          filterLayout,
                          true,  // isFloating
                          false,  // isSingleLine
                          null,
                          null,
                          null,
                          null,
                          () => this.handleChange,
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
        { isWidthDown('xs', width) ? (
          <div>
            <Collapse in={openFilter} timeout='auto' unmountOnExit>
              {createFormLayout(
                filters,
                tableHead.filter(col => col.searchable === true),
                filterLayout,
                true,  // isFloating
                false,
                null,
                null,
                null,
                null,
                () => this.handleChange,
                null,
              )}
            </Collapse>
          </div>
        ) : null}
        {/* 追加ダイアログ */}
        {(addProps && addProps.visible !== false && common.isEmpty(selected)) ? (
          <FormDialog
            title={`${title}を追加`}
            innerRef={(dlg) => { this._showAddDialog = dlg && dlg.handleOpen }}
            {...addProps}
          />
        ) : null}
        {/* 変更ダイアログ */}
        {(editProps && editProps.visible !== false && Array.isArray(selected) && selected.length === 1) ? (
          <FormDialog
            title={`${title}を変更`}
            innerRef={(dlg) => { this._showModel = dlg && dlg.handleOpen }}
            {...editProps}
            saveCallback={saveCallback}
          />
        ) : null}
        {/* 削除ダイアログ */}
        {(deleteProps && deleteProps.visible !== false && Array.isArray(selected) && selected.length === 1) ? (
          <ConfirmDialog
            title='削除'
            innerRef={(dlg) => { this._showDeleteConfirm = dlg && dlg.handleOpen }}
            onOk={() => {
              deleteProps.handleDelete(this.props.selected[0]).then(() => clearSelected())
            }}
          />
        ) : null}
      </div>
    );
  }
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

export default withStyles(styles)(withWidth()(DataTableToolbar));
