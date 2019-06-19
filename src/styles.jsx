const defaultFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: "300",
  lineHeight: "1.5em"
};

const primaryColor = "#9c27b0";
const warningColor = "#ff9800";
const dangerColor = "#f44336";
const successColor = "#4caf50";
const infoColor = "#00acc1";
const roseColor = "#e91e63";
const grayColor = "#999999";

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
    fontSize: "0.85em",
  },
  tableFixedHeader: {
    "& th": {
      boxSizing: 'border-box',
    }
  },
  tableCell: {
    ...defaultFont,
    lineHeight: "1.42857143",
    // padding: "12px 8px",
    verticalAlign: "middle",
    fontSize: "0.85em",
  },
  tableCellCheckable: {
    width: 42,
  },
  tableResponsive: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflow: "visible",
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
});

export default tableStyle;
