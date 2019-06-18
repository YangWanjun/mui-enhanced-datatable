export const columns = [
  {
    "name": "name",
    "type": "string",
    "label": "名前",
    "link": '/detail/%(pk)s/',
    "maxWidth": 260,
  },
  {
    "name": "class_name",
    "type": "string",
    "label": "クラス",
  },
  {
    "name": "english",
    "type": "integer",
    "label": "英語",
  },
  {
    "name": "evaluation",
    "type": "choice",
    "label": "評価",
    "choices": [
      { "value": "1", "display_name": "非常にいい" },
      { "value": "2", "display_name": "とてもいい" },
      { "value": "3", "display_name": "比較的にいい" },
      { "value": "4", "display_name": "合格" },
      { "value": "5", "display_name": "不合格" },
      { "value": "6", "display_name": "危ない" },
    ]
  },
];

export const rows = [
  { "pk": 1, "name": "李　一", "class_name": "３-Ａ", "english": "80", "evaluation": "5" },
  { "pk": 2, "name": "王　一", "class_name": "３-Ａ", "english": "120", "evaluation": "2" },
  { "pk": 3, "name": "趙　一", "class_name": "３-Ａ", "english": "150", "evaluation": "1" },
  { "pk": 4, "name": "楊　一", "class_name": "３-Ａ", "english": "130", "evaluation": "2" },
  { "pk": 5, "name": "劉　一", "class_name": "３-Ａ", "english": "121", "evaluation": "2" },
  { "pk": 6, "name": "蔣　一", "class_name": "３-Ａ", "english": "122", "evaluation": "2" },
  { "pk": 7, "name": "花　一", "class_name": "３-Ａ", "english": "123", "evaluation": "2" },
  { "pk": 8, "name": "李　一", "class_name": "３-Ｂ", "english": "124", "evaluation": "2" },
  { "pk": 9, "name": "王　二", "class_name": "３-Ｂ", "english": "125", "evaluation": "2" },
  { "pk": 10, "name": "趙　二", "class_name": "３-Ｂ", "english": "150", "evaluation": "1" },
  { "pk": 11, "name": "楊　二", "class_name": "３-Ｂ", "english": "91", "evaluation": "4" },
  { "pk": 12, "name": "劉　二", "class_name": "３-Ｂ", "english": "92", "evaluation": "4" },
  { "pk": 13, "name": "蔣　二", "class_name": "３-Ｂ", "english": "93", "evaluation": "4" },
  { "pk": 14, "name": "花　二", "class_name": "３-Ｂ", "english": "94", "evaluation": "4" },
  { "pk": 15, "name": "李　三", "class_name": "３-Ｃ", "english": "95", "evaluation": "4" },
  { "pk": 16, "name": "王　三", "class_name": "３-Ｃ", "english": "96", "evaluation": "4" },
  { "pk": 17, "name": "趙　三", "class_name": "３-Ｃ", "english": "97", "evaluation": "4" },
  { "pk": 18, "name": "楊　三", "class_name": "３-Ｃ", "english": "98", "evaluation": "4" },
  { "pk": 19, "name": "劉　三", "class_name": "３-Ｃ", "english": "100", "evaluation": "3" },
  { "pk": 20, "name": "蔣　三", "class_name": "３-Ｃ", "english": "101", "evaluation": "3" },
  { "pk": 21, "name": "花　三", "class_name": "３-Ｃ", "english": "102", "evaluation": "3" },
  { "pk": 22, "name": "99999999999999999999999999999999999999999999999999999999", "class_name": "３-Ｃ", "english": "102", "evaluation": "3" },
]
