import React from "react";
import classNames from 'classnames';
import {
  Typography,
} from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Toolbar,
  Tooltip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@material-ui/core";
import FilterListIcon from '@material-ui/icons/FilterList';
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { lighten } from '@material-ui/core/styles/colorManipulator';
import ControlCreator from './ControlCreator';
import { common } from "./common";

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
    textAlign: 'right',
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
});

class DataTableToolbar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openFilter: false,
      filters: props.filters,
    };
  }

  handleOpenFilter = () => {
    this.setState({ openFilter: true });
  };

  handleCloseFilter = () => {
    this.setState({ openFilter: false });
  };

  handleClearFilter = () => {
    this.setState({ filters: {} });
    if (this.props.onChangeFilter) {
      this.props.onChangeFilter({});
    }
  }

  handleDeleteFilter = name => () => {
    const { filters } = this.state;
    delete filters[name];
    if (this.props.onChangeFilter) {
      this.props.onChangeFilter(filters);
    }
  };

  handleChange = (name, value, type) => {
    if (type === 'boolean') {
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else {
        value = '';
      }
    }

    this.setState((state) => {
      let filters = state.filters;
      if (value === '' || value === null) {
        delete filters[name];
      } else {
        filters[name] = value;
      }
      if (this.props.onChangeFilter) {
        this.props.onChangeFilter(filters);
      }
      return {filters: filters};
    });
  };

  createCsvAction = () => {
    const { title, tableHead, tableData } = this.props;
    return (
      <Tooltip title='CSVダウンロード' placement='bottom' enterDelay={300}>
        <IconButton
          aria-label="Action"
          onClick={() => common.downloadDataTableCSV(title, tableHead, tableData)}
        >
          <CloudDownloadIcon/>
        </IconButton>
      </Tooltip>
    );
  }

  createActions = () => {
    const { selected, tableActions, rowActions, tableData } = this.props;
    if (Array.isArray(selected) && selected.length > 0 ) {
      // 行ごとのアクション
      let data = null;
      if (selected.length === 1) {
        data = common.getFromList(tableData, '__index__', selected[0]);
      } else {
        data = tableData.filter(row => selected.indexOf(row.__index__) >= 0);
      }
      return (
        <React.Fragment>
          {rowActions.map((action, key) => (
            <Tooltip key={key} title={action.tooltip} placement='bottom' enterDelay={300}>
              <IconButton aria-label="Action" onClick={() => action.handleClick(data)}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {tableActions.map((action, key) => (
            <Tooltip key={key} title={action.tooltip} placement='bottom' enterDelay={300}>
              <IconButton aria-label="Action" onClick={action.handleClick}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </React.Fragment>
      );
    }
  };

  render() {
    const { classes, title, tableHead, fixedOption, selected, allowCsv } = this.props;
    const { filters } = this.state;
    const numSelected = selected.length;
    let fixedStyles = null;
    if (fixedOption && fixedOption.visible === true) {
      fixedStyles = {
        position: "fixed",
        backgroundColor: 'white',
        zIndex: 1,
        ...fixedOption.positions,
      }
    }

    return (
      <div id={this.props.id} style={fixedStyles}>
        <Toolbar
          className={classNames(classes.root, {
            [classes.highlight]: numSelected > 0,
          })}
        >
          <div className={classes.title}>
            {numSelected > 0 ? (
              <Typography color="inherit" variant="subheading" className={classes.selected}>
                {numSelected} 選択
              </Typography>
            ) : null}
            {Object.keys(filters).map(name => {
              const value = filters[name];
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
            {allowCsv ? this.createCsvAction() : null}
            {tableHead.filter(col => col.searchable === true).length > 0 ? (
              <Tooltip title="検索" placement='bottom' enterDelay={300}>
                <IconButton aria-label="Filter list" onClick={this.handleOpenFilter}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </div>
        </Toolbar>
        <Dialog
          open={this.state.openFilter}
          onClose={this.handleCloseFilter}
          aria-labelledby="form-dialog-title"
        >
          <form>
            <DialogTitle id="form-dialog-title">{title} 検索</DialogTitle>
            <DialogContent>
              {tableHead.map((column, key) => {
                if (column.searchable === true) {
                  let value = filters[column.name];
                  if (value === null || value === undefined) {
                    value = '';
                  }
                  return (
                    <ControlCreator
                      key={key}
                      column={column}
                      value={value}
                      handleChange={this.handleChange}
                    />
                  )
                }
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClearFilter} color="secondary">
                クリア
              </Button>
              <Button onClick={this.handleCloseFilter} color="primary">
                閉じる
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(DataTableToolbar);
