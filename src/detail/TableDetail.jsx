import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import withStyles from "@material-ui/core/styles/withStyles";
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
import detailStyle from '../assets/css/detail';
import FormDialog from '../dialog/FormDialog';
import { common } from '../utils/index';
import ConfirmDialog from "../dialog/ConfirmDialog";

const useStyles = makeStyles(detailStyle);

function TableDetail(props) {
  const { avatar, title, schema, actions, editProps, deleteProps, cardMenuItems, loading } = props;
  const [ open, setOpen ] = useState(false);
  const [ anchorEl, setAnchorEl] = useState(null);
  const [ data, setData ] = useState(props.data || {});
  const dlgDeleteRef = useRef(null);
  const classes = useStyles();
  let _showEditDialog = null;

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
  //     this.setState({data: nextProps.data});
  //   }
  // }

  const handleOpenMenu = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(false);
  };

  const handleMenuListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
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
    if (this._showEditDialog) {
      const { data } = this.state;
      this._showEditDialog(data);
    }
  };

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
              onClick={() => dlgDeleteRef.current()} 
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
          ref={(dialog) => {_showEditDialog = dialog && dialog.handleOpen}}
        />
      ) : null}
      {!common.isEmpty(deleteProps) && deleteProps.visible !== false ? (
        <ConfirmDialog
          title='削除してもよろしいですか。'
          onOk={deleteProps.handleDelete}
          anchorEl={dlgDeleteRef}
        />
      ) : null}
      {cardMenuItems ? (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
        >{cardMenuItems}</Menu>
      ) : null}
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
};

TableDetail.defaultProps = {
  actions: [],
  editProps: {},
  deleteProps: {},
  loading: false,
};

export default TableDetail;
