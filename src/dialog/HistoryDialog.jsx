import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
} from '@material-ui/core';
import SimpleTable from '../datatable/SimpleTable';

const useStyles = makeStyles(theme => ({
  histories: {
    minWidth: '500px',
    '& table': {
      minWidth: 'inherit',
    }
  },
  fullScreen: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      margin: 0,
      maxWidth: '100%',
      maxHeight: 'none',
      borderRadius: 0,
    },
  },
}));

const historySchema = [
  {
    "name": "label",
    "type": "string",
    "label": "項目",
  },
  {
    "name": "start_date",
    "type": "date",
    "label": "変更日",
  },
  {
    "name": "value",
    "type": "string",
    "label": "値",
  },
  {
    "name": "display_text",
    "type": "string",
    "label": "表示名",
  },
]

const HistoryDialog = forwardRef((props, ref) => {
  const [ open, setOpen ] = useState(false);
  const [ histories, setHistories ] = useState([]);
  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    handleOpen: (histories) => {
      setOpen(true);
      setHistories(histories)
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      scroll='body'
      onClose={handleClose}
      PaperProps={{className: classes.fullScreen}}
    >
      <DialogTitle>
        変更履歴
      </DialogTitle>
      <DialogContent dividers className={classes.histories}>
        <SimpleTable
          tableHead={historySchema}
          tableData={histories}
          tableHeaderColor={'warning'}
          rowsPerPage={25}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  )
})

// HistoryDialog.propTypes = {
//   schema: PropTypes.array,
// };
HistoryDialog.displayName = "HistoryDialog";

export default HistoryDialog;
