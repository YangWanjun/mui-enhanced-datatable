import React from "react";
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
} from '@material-ui/core';
import detailStyle from '../assets/css/detail';
import FormDialog from '../dialog/FormDialog';
import { common } from '../utils/index';

class MyTableDetail extends React.Component {

  constructor(props) {
    super(props);

    this.onShowEditDialog = this.onShowEditDialog.bind(this);
    this.state = {
      data: props.data || {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.setState({data: nextProps.data});
    }
  }

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
    const { classes, title, schema, actions, editProps, deleteProps } = this.props;
    const { data } = this.state;

    return (
      <div>
        <Card>
          <CardHeader
            avatar={this.getAvatar()}
            title={title}
          />
          <CardContent>
            <Table className={classes.table}>
              <TableBody>
                {schema.map(col => {
                  const value = data[col.name];
                  let display_name = value;
                  if (col.type === 'choice') {
                    display_name = common.getDisplayNameFromChoice(value, col);
                  }
                  return (
                    <TableRow key={col.name}>
                      <TableCell className={classes.tableCell + ' ' + classes.tableHeadCell}>{col.label}</TableCell>
                      <TableCell className={classes.tableCell}>
                        <Typography style={{whiteSpace: 'pre-line'}}>
                          {col.link ? (
                            <Link to={common.formatStr(col.link, data)}>{display_name}</Link>
                          ) : display_name}
                        </Typography>
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
            {deleteProps ? (
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={this.onShowDeleteDialog}
              >
                &nbsp;&nbsp;削&nbsp;&nbsp;除&nbsp;&nbsp;
              </Button>
            ) : null}
            {editProps ? (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.onShowEditDialog}
              >
                &nbsp;&nbsp;変&nbsp;&nbsp;更&nbsp;&nbsp;
              </Button>
            ) : null}
          </CardActions>
        </Card>
        <FormDialog
          title={editProps.title}
          schema={editProps.schema}
          handleOk={editProps.handleEdit}
          ref={(dialog) => {this._showEditDialog = dialog && dialog.handleOpen}}
        />
      </div>
    );
  }
}

MyTableDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  schema: PropTypes.array.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object),
  editProps: PropTypes.object,
  deleteProps: PropTypes.object,
};

MyTableDetail.defaultProps = {
  actions: [],
};

const TableDetail = withStyles(detailStyle)(MyTableDetail)
export { TableDetail } ;
