import React from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import withStyles from "@mui/styles/withStyles";
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import detailStyle from '../assets/css/detail';
import FormDialog from '../dialog/FormDialog';
import { common } from '../utils/index';
import ConfirmDialog from "../dialog/ConfirmDialog";

class MyTableDetail extends React.Component {

  constructor(props) {
    super(props);

    this.onShowEditDialog = this.onShowEditDialog.bind(this);
    this.state = {
      open: false,
      anchorEl: null,
      data: props.data || {},
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.setState({data: nextProps.data});
    }
  }

  handleOpenMenu = (event) => {
    this.setState({open: true, anchorEl: event.currentTarget});
  };

  handleCloseMenu = (event) => {
    this.setState({open: false});
  };

  handleMenuListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({open: false});
    }
  };

  getAvatar = () => {
    const { classes, avatar } = this.props;
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
  
  onShowEditDialog = () => {
    if (this._showEditDialog) {
      const { data } = this.state;
      this._showEditDialog(data);
    }
  };

  render() {
    const { classes, title, schema, actions, editProps, deleteProps, cardMenuItems, loading } = this.props;
    const { open, anchorEl, data } = this.state;

    return (
      <div>
        <Card>
          <CardHeader
            avatar={this.getAvatar()}
            title={title}
            titleTypographyProps={{className: classes.title}}
            className={classes.title}
            action={cardMenuItems ? (
              <IconButton
                aria-owns={anchorEl ? "menu" : null}
                aria-haspopup="true"
                onClick={this.handleOpenMenu}
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
                onClick={() => this.__confirm ? this.__confirm() : null} 
              >
                削除
              </Button>
            ) : null}
            {!common.isEmpty(editProps) && editProps.visible !== false ? (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.onShowEditDialog}
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
            ref={(dialog) => {this._showEditDialog = dialog && dialog.handleOpen}}
          />
        ) : null}
        {!common.isEmpty(deleteProps) && deleteProps.visible !== false ? (
          <ConfirmDialog
            title='削除してもよろしいですか。'
            onOk={deleteProps.handleDelete}
            innerRef={dlg => { this.__confirm = dlg && dlg.handleOpen }}
          />
        ) : null}
        {cardMenuItems ? (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={this.handleCloseMenu}
          >{cardMenuItems}</Menu>
        ) : null}
      </div>
    );
  }
}

MyTableDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  data: PropTypes.object.isRequired,
  schema: PropTypes.array.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object),
  editProps: PropTypes.object,
  deleteProps: PropTypes.object,
  cardMenuItems: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};

MyTableDetail.defaultProps = {
  actions: [],
  editProps: {},
  deleteProps: {},
  loading: false,
};

const TableDetail = withStyles(detailStyle)(MyTableDetail)
export { TableDetail } ;
