import PropTypes from "prop-types";

export default {
  tableProps: {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string,
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
  INFO: {
    NO_DATA: 'データはありません。',
    INPUT_KEYWORD: '検索キーワードを入力し、エンターキーを押下してください。',
    DELETE_CONFIRM: 'データを削除します、よろしいですか？',
    NO_NOTIFICATIONS: '通知はありません。',
  },
  ERROR: {
    REQUIRE_FIELD: '%(name)sは必須項目です。',
    FORM_CHECK_ERROR: 'エラー発生しました。',
    INVALID_DATA: '有効なデータを入力してください。',
    FILE_SIZE_LIMIT: 'ファイルサイズは制限%(limit)sを超えました。'
  },
};
