import { red } from '@material-ui/core/colors';
import {
  defaultFont,
} from './common';

const tableDetailStyle = (theme) => ({
  avatar: {
    backgroundColor: red[500],
  },
  title: {
    fontSize: 20,
    paddingBottom: 0,
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
    // fontSize: "12px",
  },
  actions: {
    padding: 16,
  },
  linearProgress: {
    height: theme.spacing(1),
    maxWidth: 300,
    '& .MuiLinearProgress-bar1Indeterminate': {
      opacity: 0.5,
    },
    '& .MuiLinearProgress-bar2Indeterminate': {
      opacity: 0.5,
    },
  },
  historyIcon: {
    padding: 0,
    marginLeft: theme.spacing(1),

    '& svg': {
      fontSize: "20px",
    },
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
});

export default tableDetailStyle;
