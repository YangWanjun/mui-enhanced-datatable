import React from "react";
import uuid from 'uuid';
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
} from "@material-ui/core";
// core components
import DataTableCell from './DataTableCell';
import DataTableHead from './DataTableHead';
import DataTablePagination from './DataTablePagination';
import DataTableToolbar from "./DataTableToolbar";
import DataTableFixedHead from "./DataTableFixedHead";
import tableStyle from "./styles";
import { common } from "./common";
import { constant } from "./constant";

class MyEnhancedTable extends React.Component {
  tableId = uuid();
  toolbarId = uuid();

  constructor(props) {
    super(props);

    this.state = {
      tableData: common.initTableData(props.tableData),
      page: 0,
      rowsPerPage: props.rowsPerPage,
      order: 'asc',
      orderBy: '',
      orderNumeric: false,
      filters: props.filters,
      selected: [],
      fixedHeaderOption: {
        visible: false,
      },
      fixedToolbarOption: {
        visible: false,
      },
    };
  }

  handleFixedHeader = () => {
    let { pushpinTop } = this.props;
    let toolbarHeight = 0;
    if (this.props.toolbar) {
      toolbarHeight = document.getElementById(this.toolbarId).getBoundingClientRect().height;
      const tableHeight = document.getElementById(this.tableId).getBoundingClientRect().height;
      const fixedToolbarOption = common.getFixedDivOption(this.toolbarId, tableHeight, pushpinTop);
      this.setState({fixedToolbarOption});
    }
    const fixedHeaderOption = common.getFixedHeaderOption(this.tableId, pushpinTop + toolbarHeight);
    this.setState({fixedHeaderOption});
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleFixedHeader);
    window.addEventListener('resize', this.handleFixedHeader);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleFixedHeader);
    window.removeEventListener('resize', this.handleFixedHeader);
  }

  handleChangePage = (event, page) => {
    this.handleFixedHeader();
    this.setState({page});
  };

  handleChangeRowsPerPage = event => {
    this.handleFixedHeader();
    if (this.props.server) {
    } else {
      this.setState({ rowsPerPage: event.target.value });
    }
  };

  handleSort = (event, property, orderNumeric) => {
    const orderBy = property;
    let order = 'desc';
    let order_by = property;

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    } else {
      order_by = '-' + order_by;
    }
    this.handleFixedHeader();
    this.setState({ order, orderBy, orderNumeric });
  };

  handleChangeFilter = (filters) => {
    this.handleFixedHeader();
    this.setState({ filters });
  };

  isSelected = index => {
    return this.state.selected.indexOf(index) !== -1
  };

  handleRowSelect = (index) => {
    if (this.props.selectable === 'none') {
      return;
    }
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];
    if (this.props.selectable === 'multiple') {
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, index);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
    } else if (this.props.selectable === 'single') {
      if (selectedIndex === -1) {
        newSelected = [index];
      } else {
        newSelected = [];
      }
    }

    this.setState({ selected: newSelected });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      const { filters } = this.state;
      const results = common.stableFilter(this.props.tableData, filters);
      this.setState(state => ({ selected: results.map(row => row.__index__) }));
      return;
    }
    this.setState({ selected: [] });
  };

  render() {
    const { classes, tableHead, tableData, tableActions, rowActions, toolbar, selectable } = this.props;
    const { filters, page, rowsPerPage, order, orderBy, orderNumeric, fixedHeaderOption, fixedToolbarOption, selected } = this.state;
    let results = common.stableSort(tableData, common.getSorting(order, orderBy, orderNumeric));
    if (!common.isEmpty(filters)) {
      results = common.stableFilter(results, filters);
    }
    const headerProps = {
      classes: classes,
      tableHeaderColor: this.props.tableHeaderColor,
      tableHead: tableHead,
      actions: tableActions ? tableActions : (rowActions ? true : false),
      onSort: this.handleSort,
      order: order,
      orderBy: orderBy,
      selectable: selectable,
      selected: selected,
      data: results,
      onSelectAllClick: this.handleSelectAllClick,
    }
    const toolbarProps = {
      title: this.props.title,
      filters: filters,
      tableHead: tableHead,
      onChangeFilter: this.handleChangeFilter,
    }

    return (
      <div className={classes.tableResponsive}>
        {toolbar ? (
          <DataTableToolbar
            id={this.toolbarId}
            {...toolbarProps}
          />
        ) : null}
        {toolbar && fixedHeaderOption && fixedHeaderOption.visible === true ? (
          <DataTableToolbar
            {...toolbarProps}
            fixedOption={fixedToolbarOption}
          />
        ) : null}
        <Table className={classes.table} id={this.tableId} {...this.props.tableProps}>
          <DataTableHead
            {...headerProps}
          />
          <TableBody>
            {common.getDataForDisplay(results, rowsPerPage, page)
              .map((row, key) => {
                const rowStyles = common.getExtraRowStyles(row, tableHead);
                const isSelected = this.isSelected(row.__index__);
                let chkCell = null;
                if (selectable === 'multiple' || selectable === 'single') {
                  chkCell = (
                    <TableCell padding="none">
                      <Checkbox checked={isSelected} onClick={() => this.handleRowSelect(row.__index__)} />
                    </TableCell>
                  );
                }
                return (
                  <TableRow key={key} className={classes.tableRow} style={{...rowStyles}}>
                    {chkCell}
                    {tableHead.map((col, key) => {
                      return (
                        <DataTableCell
                          key={key}
                          classes={classes}
                          column={col}
                          data={row}
                        />
                      );
                    })}
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
        <DataTablePagination
          component="div"
          count={results.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={this.props.rowsPerPageOptions}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        {fixedHeaderOption && fixedHeaderOption.visible === true ? (
          <DataTableFixedHead
            classes={classes}
            fixedPosition={fixedHeaderOption.positions}
            children={
              <DataTableHead
                {...headerProps}
                colsWidth={fixedHeaderOption.colsWidth}
              />
            }
          />
        ) : null}
      </div>
    );
  }
}

MyEnhancedTable.propTypes = {
  ...constant.tableProps,
  ...constant.tableActionProps,
  selectable: PropTypes.oneOf(['none', 'single', 'multiple']),
  pk: PropTypes.string,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  server: PropTypes.bool,
  toolbar: PropTypes.bool,
  title: PropTypes.string,
  filters: PropTypes.object,
  pushpinTop: PropTypes.number,
};

MyEnhancedTable.defaultProps = {
  ...constant.tablePropsDefault,
  ...constant.tableActionPropsDefault,
  selectable: 'none',
  pk: 'id',
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 25, 50],
  server: false,
  toolbar: true,
  title: null,
  filters: {},
  pushpinTop: 0,
};

const EnhancedTable = withStyles(tableStyle)(MyEnhancedTable)
export { EnhancedTable } ;
