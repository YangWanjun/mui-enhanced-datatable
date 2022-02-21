import React from "react";
import PropTypes from "prop-types";
// @mui/material components
import { createTheme, ThemeProvider } from '@mui/material/styles';
import withStyles from "@mui/styles/withStyles";
import {
  TablePagination,
  IconButton,
} from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage'

const theme = createTheme();

const paginationActionsStyles = {
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
};

const styles = {
  root: {
    '& .MuiTablePagination-caption, & .MuiTablePagination-selectRoot': {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  }
};

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onPageChange(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onPageChange(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onPageChange(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onPageChange(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <IconButton
            onClick={this.handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="First Page"
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            onClick={this.handleBackButtonClick}
            disabled={page === 0}
            aria-label="Previous Page"
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={this.handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Next Page"
          >
            <KeyboardArrowRight />
          </IconButton>
          <IconButton
            onClick={this.handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
          >
            <LastPageIcon />
          </IconButton>
        </div>
      </ThemeProvider>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const TablePaginationActionsWrapped = withStyles(paginationActionsStyles, { withTheme: true })(
  TablePaginationActions,
);

class DataTablePagination extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <TablePagination
        {...this.props}
        className={classes.root}
        style={{overflow: 'visible'}}
        ActionsComponent={TablePaginationActionsWrapped}
      />
    );
  }
}

export default withStyles(styles)(DataTablePagination);