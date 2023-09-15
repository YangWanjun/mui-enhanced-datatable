export const departments = [
  { "pk": 1, "name": "第一事業部", "member_count": "1201", "leader": "田中", 'parent': null },
  { "pk": 11, "name": "第一部", "member_count": "250", "leader": "佐藤", 'parent': 1 },
  { "pk": 101, "name": "第一課", "member_count": "250", "leader": "佐藤", 'parent': 11 },
  { "pk": 102, "name": "第二課", "member_count": "250", "leader": "佐藤", 'parent': 11 },
  { "pk": 103, "name": "第三課", "member_count": "250", "leader": "佐藤", 'parent': 11 },
  { "pk": 12, "name": "第二部", "member_count": "250", "leader": "佐藤", 'parent': 1 },
  { "pk": 121, "name": "第一課", "member_count": "250", "leader": "佐藤", 'parent': 12 },
  { "pk": 122, "name": "第二課", "member_count": "250", "leader": "佐藤", 'parent': 12 },
  { "pk": 123, "name": "第三課", "member_count": "250", "leader": "佐藤", 'parent': 12 },
  { "pk": 13, "name": "第三部", "member_count": "250", "leader": "佐藤", 'parent': 1 },
  { "pk": 131, "name": "第一課", "member_count": "250", "leader": "佐藤", 'parent': 13 },
  { "pk": 2, "name": "第二事業部", "member_count": "800", "leader": "田中", 'parent': null },
  { "pk": 21, "name": "第一部", "member_count": "250", "leader": "佐藤", 'parent': 2 },
  { "pk": 201, "name": "第一課", "member_count": "250", "leader": "佐藤", 'parent': 21 },
  { "pk": 202, "name": "第二課", "member_count": "250", "leader": "佐藤", 'parent': 21 },
  { "pk": 203, "name": "第三課", "member_count": "250", "leader": "佐藤", 'parent': 21 },
  { "pk": 22, "name": "第二部", "member_count": "250", "leader": "佐藤", 'parent': 2 },
  { "pk": 221, "name": "第一課", "member_count": "250", "leader": "佐藤", 'parent': 22 },
  { "pk": 222, "name": "第二課", "member_count": "250", "leader": "佐藤", 'parent': 22 },
  { "pk": 223, "name": "第三課", "member_count": "250", "leader": "佐藤", 'parent': 22 },
  { "pk": 23, "name": "第三部", "member_count": "250", "leader": "佐藤", 'parent': 2 },
  { "pk": 231, "name": "第一課", "member_count": "250", "leader": "佐藤", 'parent': 23 },
];

export const columns = [
  {
    "name": "name",
    "type": "string",
    "label": "名前",
    "link": '/detail/%(pk)s/',
    "maxWidth": 260,
    "sortable": true,
    "searchable": true,
  },
  {
    "name": "join_date",
    "type": "date",
    "label": "入社日",
  },
  {
    "name": "address",
    "type": "string",
    "label": "住所",
  },
  {
    "name": "salary",
    "type": "integer",
    "label": "給料",
    "sortable": true,
    "aggregate": "sum",
  },
  {
    "name": "dept",
    "type": "choice",
    "label": "所属部署",
    "choices": departments.map((item, idx) => ({"value": item.pk, "display_name": item.name, "parent": item.parent})),
    "sortable": true,
    "searchable": true,
  },
  {
    "name": "retired",
    "type": "boolean",
    "label": "退職",
    "sortable": true,
    "searchable": true,
    "variant": 'select',
    "rowStyles": {
      1: {'backgroundColor': 'lightgray'}
    },
  },
];

export const rows = [
  {'pk': 1, 'name': '森 直樹', 'dept': 1, 'address': '福井県夷隅郡大多喜町方京13丁目1番20号', 'salary': 700000, 'retired': false},
  {'pk': 2, 'name': '佐藤 智也', 'dept': 23, 'address': '兵庫県印旛郡本埜村柿木沢30丁目25番2号', 'salary': 720000, 'retired': false},
  {'pk': 3, 'name': '近藤 七夏', 'dept': 102, 'address': '京都府匝瑳市池之端27丁目5番19号 パーク六番町232', 'salary': 700000, 'retired': false},
  {'pk': 4, 'name': '山崎 花子', 'dept': 222, 'address': '茨城県川崎市高津区丸の内33丁目6番1号', 'salary': 710000, 'retired': false},
  {'pk': 5, 'name': '山本 裕太', 'dept': 12, 'address': '福岡県墨田区上高野17丁目23番5号 コーポ日本堤685', 'salary': 420000, 'retired': true},
  {'pk': 6, 'name': '青木 健一', 'dept': 23, 'address': '宮崎県川崎市多摩区土沢20丁目7番10号 上高野アーバン241', 'salary': 460000, 'retired': false},
  {'pk': 7, 'name': '藤原 幹', 'dept': 21, 'address': '栃木県横浜市磯子区外国府間9丁目17番5号 氏家コート797', 'salary': 570000, 'retired': false},
  {'pk': 8, 'name': '三浦 太一', 'dept': 11, 'address': '岐阜県新宿区脚折町33丁目20番9号', 'salary': 470000, 'retired': false},
  {'pk': 9, 'name': '山本 裕太', 'dept': 202, 'address': '愛知県清瀬市東神田32丁目23番2号 アーバン千束384', 'salary': 460000, 'retired': false},
  {'pk': 10, 'name': '鈴木 春香', 'dept': 12, 'address': '島根県西多摩郡日の出町竜泉32丁目13番15号 コーポ卯の里771', 'salary': 690000, 'retired': true},
  {'pk': 11, 'name': '林 太一', 'dept': 23, 'address': '青森県川崎市高津区元浅草28丁目10番7号 アーバン一ツ橋194', 'salary': 670000, 'retired': false},
  {'pk': 12, 'name': '小川 真綾', 'dept': 13, 'address': '山梨県横浜市泉区下宇和田2丁目16番20号', 'salary': 410000, 'retired': false},
  {'pk': 13, 'name': '鈴木 香織', 'dept': 202, 'address': '茨城県新島村神明内40丁目26番11号 芝公園クレスト080', 'salary': 700000, 'retired': false},
  {'pk': 14, 'name': '木村 さゆり', 'dept': 101, 'address': '山形県東村山市四番町4丁目1番7号 上野公園アーバン181', 'salary': 610000, 'retired': false},
  {'pk': 15, 'name': '吉田 結衣', 'dept': 131, 'address': '茨城県八街市神明内22丁目1番1号 平河町コート983', 'salary': 700000, 'retired': true},
  {'pk': 16, 'name': '渡辺 直人', 'dept': 11, 'address': '沖縄県府中市勝どき24丁目13番13号 シャルム方京209', 'salary': 530000, 'retired': false},
  {'pk': 17, 'name': '中村 明美', 'dept': 2, 'address': '熊本県御蔵島村鍛冶ケ沢6丁目19番5号 コート橋場560', 'salary': 430000, 'retired': false},
  {'pk': 18, 'name': '藤原 健一', 'dept': 102, 'address': '群馬県東久留米市小入14丁目5番20号 パレス丸の内498', 'salary': 400000, 'retired': false},
  {'pk': 19, 'name': '木村 桃子', 'dept': 202, 'address': '香川県あきる野市天神島35丁目10番13号 箭坪アーバン428', 'salary': 520000, 'retired': false},
  {'pk': 20, 'name': '佐藤 学', 'dept': 22, 'address': '福島県稲城市氏家14丁目4番10号 油井コーポ104', 'salary': 700000, 'retired': true},
  {'pk': 21, 'name': '中村 裕太', 'dept': 12, 'address': '埼玉県西多摩郡檜原村上野公園7丁目2番12号', 'salary': 450000, 'retired': false},
  {'pk': 22, 'name': '伊藤 さゆり', 'dept': 23, 'address': '熊本県安房郡鋸南町筑土八幡町3丁目23番2号 パーク柿木沢新田954', 'salary': 570000, 'retired': false},
  {'pk': 23, 'name': '石井 香織', 'dept': 222, 'address': '福島県浦安市三筋33丁目21番9号 パレス西関宿182', 'salary': 430000, 'retired': false},
  {'pk': 24, 'name': '吉田 里佳', 'dept': 13, 'address': '山梨県香取郡多古町今戸33丁目12番7号 アーバン下宇和田773', 'salary': 650000, 'retired': false},
  {'pk': 25, 'name': '後藤 裕樹', 'dept': 231, 'address': '東京都横浜市旭区鶴ヶ丘18丁目17番2号', 'salary': 620000, 'retired': true},
  {'pk': 26, 'name': '小林 桃子', 'dept': 101, 'address': '大阪府浦安市元浅草38丁目26番5号 四区町パレス938', 'salary': 490000, 'retired': false},
  {'pk': 27, 'name': '高橋 浩', 'dept': 201, 'address': '愛媛県鴨川市脚折40丁目13番7号 コーポ中宮祠676', 'salary': 760000, 'retired': false},
  {'pk': 28, 'name': '田中 香織', 'dept': 121, 'address': '宮城県西多摩郡日の出町方京34丁目16番1号 下吉羽コート597', 'salary': 730000, 'retired': false},
  {'pk': 29, 'name': '佐々木 智也', 'dept': 201, 'address': '佐賀県横浜市旭区虎ノ門22丁目11番13号 柿木沢新田シャルム275', 'salary': 490000, 'retired': false},
  {'pk': 30, 'name': '佐藤 翔太', 'dept': 12, 'address': '山形県山武市鍛冶ケ沢11丁目7番16号', 'salary': 780000, 'retired': true},
  {'pk': 31, 'name': '松本 太郎', 'dept': 222, 'address': '岡山県多摩市台場30丁目3番17号', 'salary': 680000, 'retired': false},
  {'pk': 32, 'name': '中川 真綾', 'dept': 102, 'address': '島根県横浜市金沢区千塚5丁目10番8号 小入シャルム597', 'salary': 470000, 'retired': false},
  {'pk': 33, 'name': '松本 拓真', 'dept': 222, 'address': '香川県神津島村港南36丁目19番11号', 'salary': 500000, 'retired': false},
  {'pk': 34, 'name': '佐藤 康弘', 'dept': 102, 'address': '石川県横浜市鶴見区六番町12丁目11番4号', 'salary': 740000, 'retired': false},
  {'pk': 35, 'name': '佐々木 裕美子', 'dept': 201, 'address': '岩手県横浜市旭区箭坪4丁目20番9号', 'salary': 770000, 'retired': true},
  {'pk': 36, 'name': '井上 結衣', 'dept': 102, 'address': '高知県浦安市前弥六南町38丁目21番17号 シャルム芝大門392', 'salary': 450000, 'retired': false},
  {'pk': 37, 'name': '阿部 千代', 'dept': 22, 'address': '栃木県横浜市瀬谷区吾妻橋20丁目8番12号 芝公園クレスト857', 'salary': 690000, 'retired': false},
  {'pk': 38, 'name': '伊藤 淳', 'dept': 102, 'address': '青森県府中市柿木沢新田15丁目3番8号 クレスト松石893', 'salary': 560000, 'retired': false},
  {'pk': 39, 'name': '鈴木 知実', 'dept': 11, 'address': '福井県御蔵島村外国府間14丁目2番14号', 'salary': 680000, 'retired': false},
  {'pk': 40, 'name': '中村 晃', 'dept': 202, 'address': '岩手県多摩市東三島23丁目19番20号', 'salary': 780000, 'retired': true},
  {'pk': 41, 'name': '伊藤 結衣', 'dept': 11, 'address': '滋賀県豊島区北上野37丁目24番7号 クレスト港南094', 'salary': 590000, 'retired': false},
  {'pk': 42, 'name': '山口 裕美子', 'dept': 202, 'address': '山梨県東村山市藤金11丁目9番5号 高田馬場アーバン541', 'salary': 640000, 'retired': false},
  {'pk': 43, 'name': '山本 直子', 'dept': 102, 'address': '長野県横浜市磯子区日光35丁目7番18号', 'salary': 480000, 'retired': false},
  {'pk': 44, 'name': '橋本 直樹', 'dept': 131, 'address': '鳥取県御蔵島村大中7丁目1番16号', 'salary': 540000, 'retired': false},
];

export const hierarchyColumns = [
  {
    "name": "name",
    "type": "string",
    "label": "部署名称",
    "link": '/detail/%(pk)s/',
    "maxWidth": 260,
  },
  {
    "name": "member_count",
    "type": "integer",
    "label": "人数",
  },
  {
    "name": "leader",
    "type": "string",
    "label": "部長",
  },
];
