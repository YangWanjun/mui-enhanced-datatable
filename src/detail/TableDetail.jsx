import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  Menu,
  IconButton,
  LinearProgress,
  makeStyles,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HistoryIcon from '@material-ui/icons/History';
import detailStyle from '../assets/css/detail';
import FormDialog from '../dialog/FormDialog';
import { common } from '../utils/index';
import ConfirmDialog from "../dialog/ConfirmDialog";
import HistoryDialog from "../dialog/HistoryDialog";

const useStyles = makeStyles(detailStyle);

function TableDetail(props) {
  const {
    avatar, title, schema, data, actions, editProps, deleteProps, cardMenuItems, loading, histories 
  } = props;
  const [ open, setOpen ] = useState(false);
  const [ anchorEl, setAnchorEl] = useState(null);
  const dlgDeleteRef = useRef(null);
  const classes = useStyles();
  const refEditDialog = useRef(null);
  const refHistoryDialog = useRef(null);

  const handleOpenMenu = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event) => {  // eslint-disable-line
    setOpen(false);
  };

  const getAvatar = () => {
    let avatarIcon = null;
    if (typeof avatar === 'string') {
      avatarIcon = (
        <Avatar aria-label="Recipe" className={classes.avatar} src={avatar}>
          {avatar}
        </Avatar>
      );
    }
    return avatarIcon;
  }
  
  const onShowEditDialog = () => {
    refEditDialog.current.handleOpen(data);
  };

  const hasHistory = (col, value) => {
    if (Array.isArray(histories) && histories.length > 0) {
      if (Array.isArray(col.history)) {
        if (col.history.length === 1) {
          return histories.some(i => col.history.indexOf(i.key) >= 0 && i.value != value)
        } else {
          const arrVal = (value || "").split(/[ \x20\u3000]/g)
          for (const k of col.history) {
            if (histories.some(x => x.key === k && arrVal.indexOf(x.value) < 0)) {
              return true;
            }
          }
        }
      } else {
        return histories.some(i => i.key === col.name && i.value != value)
      }
    }
    return false;
  }

  const showHistories = (col) => {
    if (Array.isArray(histories) && histories.length > 0 && refHistoryDialog.current) {
      let items = [];
      if (Array.isArray(col.history)) {
        items = histories.filter(i => col.history.indexOf(i.key) >= 0);
      } else {
        items = histories.filter(i => i.key === col.name);
      }
      refHistoryDialog.current.handleOpen(items);
    }
  }

  return (
    <div>
      <Card>
        <CardHeader
          avatar={getAvatar()}
          title={title}
          titleTypographyProps={{className: classes.title}}
          className={classes.title}
          action={cardMenuItems ? (
            <IconButton
              aria-owns={anchorEl ? "menu" : null}
              aria-haspopup="true"
              onClick={handleOpenMenu}
            >
              <MoreVertIcon />
            </IconButton>
          ) : null}
        />
        <CardContent>
          <Table className={classes.table}>
            <TableBody>
              {schema.map(col => {
                const value = data[col.name];
                const display_name = common.getColumnDisplay(value, col, data);
                return (
                  <TableRow key={col.name}>
                    <TableCell className={classes.tableCell + ' ' + classes.tableHeadCell}>{col.label}</TableCell>
                    <TableCell className={classes.tableCell}>
                      {loading ? (
                        <LinearProgress className={classes.linearProgress} />
                      ) : col.link ? (
                        <Link to={common.formatStr(typeof col.link === 'function' ? col.link(data) : col.link, data)}>{display_name}</Link>
                      ) : display_name}
                      { hasHistory(col, value) ? (
                        <IconButton
                          color="primary"
                          size="small"
                          className={classes.historyIcon}
                          onClick={() => showHistories(col)}
                        >
                          <HistoryIcon />
                        </IconButton>
                      ) : null }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions className={classes.actions}>
          { actions.map(button => {
            return button;
          })}
          <Typography style={{flex: 1}} />
          {!common.isEmpty(deleteProps) && deleteProps.visible !== false ? (
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => dlgDeleteRef.current.handleOpen()} 
            >
              削除
            </Button>
          ) : null}
          {!common.isEmpty(editProps) && editProps.visible !== false ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={onShowEditDialog}
            >
              変更
            </Button>
          ) : null}
        </CardActions>
      </Card>
      {!common.isEmpty(editProps) && editProps.visible !== false ? (
        <FormDialog
          {...editProps}
          handleOk={editProps.handleEdit}
          ref={refEditDialog}
        />
      ) : null}
      {!common.isEmpty(deleteProps) && deleteProps.visible !== false ? (
        <ConfirmDialog
          title='削除してもよろしいですか。'
          onOk={deleteProps.handleDelete}
          ref={dlgDeleteRef}
        />
      ) : null}
      {cardMenuItems ? (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
        >{cardMenuItems}</Menu>
      ) : null}
      <HistoryDialog
        ref={refHistoryDialog}
      />
    </div>
  );
}

TableDetail.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object.isRequired,
  schema: PropTypes.array.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object),
  editProps: PropTypes.object,
  deleteProps: PropTypes.object,
  cardMenuItems: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  avatar: PropTypes.any,
  histories: PropTypes.array,
};

TableDetail.defaultProps = {
  actions: [],
  editProps: {},
  deleteProps: {},
  loading: false,
  histories: [],
};

export default TableDetail;
