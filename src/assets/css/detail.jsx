import { red } from '@material-ui/core/colors';
import {
  defaultFont,
} from './common';

const tableDetailStyle = {
  avatar: {
    backgroundColor: red[500],
  },
  table: {
    marginBottom: "0",
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "transparent",
    borderSpacing: "0",
    borderCollapse: "collapse"
  },
  tableHeadCell: {
    textAlign: 'right',
    width: '30%',
    minWidth: 100,
  },
  tableCell: {
    "& p": {
      lineHeight: "1.42857143",
      fontSize: "12px",
    },
    ...defaultFont,
    lineHeight: "1.42857143",
    paddingLeft: "8px",
    paddingRight: "8px",
    verticalAlign: "middle",
    fontSize: "12px",
  },
  actions: {
    padding: 16,
  },
};

export default tableDetailStyle;
