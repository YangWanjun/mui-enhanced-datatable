import PropTypes from "prop-types";

export const constant = {
  tableProps: {
    classes: PropTypes.object.isRequired,
    tableHeaderColor: PropTypes.oneOf([
      "warning",
      "primary",
      "danger",
      "success",
      "info",
      "rose",
      "gray"
    ]),
    tableHead: PropTypes.arrayOf(PropTypes.object),
    tableData: PropTypes.arrayOf(PropTypes.object),
    tableProps: PropTypes.object,
  },
  tablePropsDefault: {
    tableHeaderColor: "gray",
    tableHead: [],
    tableData: [],
  },
  tableActionProps: {
    tableActions: PropTypes.arrayOf(PropTypes.object),
    rowActions: PropTypes.arrayOf(PropTypes.object),
    actionsTrigger: PropTypes.func,  
  },
  tableActionPropsDefault: {
    tableActions: [],
    rowActions: [],
  },
};
