import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont
} from "./common";

const tableStyle = theme => ({
  warningTableHeader: {
    color: warningColor
  },
  primaryTableHeader: {
    color: primaryColor
  },
  dangerTableHeader: {
    color: dangerColor
  },
  successTableHeader: {
    color: successColor
  },
  infoTableHeader: {
    color: infoColor
  },
  roseTableHeader: {
    color: roseColor
  },
  grayTableHeader: {
    color: grayColor
  },
  table: {
    marginBottom: "0",
    width: "100%",
    minWidth: 600,
    maxWidth: "100%",
    backgroundColor: "transparent",
    borderSpacing: "0",
    borderCollapse: "collapse"
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.07) !important"
    }
  },
  tableHeadCell: {
    color: "inherit",
    ...defaultFont,
  },
  tableFixedHeader: {
    "& th": {
      boxSizing: 'border-box',
    },
    position: "fixed",
    backgroundColor: 'white',
    tableLayout: 'fixed',
    display: 'none',
    zIndex: 1,
  },
  tableCell: {
    ...defaultFont,
    lineHeight: "1.42857143",
    paddingLeft: "8px",
    paddingRight: "8px",
    verticalAlign: "middle",
    // fontSize: "12px",
  },
  tableCellCheckable: {
    width: 42,
  },
  tableResponsive: {
    width: "100%",
    // marginTop: theme.spacing(3),
    // overflow: "visible",
  },
  tableActions: {
    display: "flex",
    padding: "12px 8px !important",
    verticalAlign: "middle",
    textAlign: 'center',
  },
  tableActionCell: {
    width: 35,
    textAlign: 'center',
    padding: 0,
  },
  tableActionButton: {
    margin: 2,
  },
  tableActionWrapper: {
    display: 'flex',
    position: 'absolute',
    top: '0',
    right: '50px',
    whiteSpace: 'nowrap',
  },
  tableRowSelected: {
    backgroundColor: '#fff0c3',
  },
  tableCellFixedWidth: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
});

export default tableStyle;
