### DEMO
https://yangwanjun.github.io/mui-enhanced-datatable/

## Tableの属性
|属性|既定値|説明|
|:---|:---|:---|
| tableHeaderColor | "gray" | ["warning", "primary", "danger", "success", "info", "rose", "gray"] |
| tableHead | [] |ヘッダーの各項目をJSONで定義されています、詳細は下記「Field Props」より説明 |
| tableData | [] |テーブルのデータ |
| tableProps | null | Material UIテーブルの属性 |


## EnhancedTable
|属性|既定値|説明|
|:---|:---|:---|
| tableActions | [] | ユーザー定義のテーブルの動作、例（レコード追加等）。 |
| rowActions | [] | ユーザー定義の行ごとの動作、例（レコード編集、削除）。 |
| selectable | 'none' | 'none': 選択できない<br>'single': 一行しか選択できない<br>'multiple': 複数行同時に選択できる。 |
| pk | 'id' | データの主キー項目,この項目の値により各データを変更したり、削除したりします |
| rowsPerPage | 10 | ページサイズ、デフォルトは改頁しない |
| rowsPerPageOptions | [5, 10, 15, 25, 50] | １ページに表示する行数 |
| server | false | フィルター、ソートなどはサーバー側で処理するのか |
| toolbar | true | ツールバーを表示するかどうか |
| title | null | テーブル名称 |
| filters | {} | フィルター項目{項目名：項目値}のＪＳＯＮ |
| pushpinTop | 0 | ヘッダー固定時ヘッダーの高さ |
| allowCsv | false | ＣＳＶダウンロード |
| urlReflect | false | フィルター、ソート時、ＵＲＬに反映するかどうか |

## Field Props
| 属性 | 既定値 | 説明 |
|:---|:---|:---|
| name | 必須 | JSON項目のキー |
| type | 必須 | 文字列として表示する,下記の選択肢があります<br>"string": 文字列<br> "integer": 整数<br>"decimal": 小数<br>"choice": 選択肢<br>"choices": 複数選択できる選択肢<br>"boolean": デフォルトはチェックボックスとして表示<br>"date": 日付<br>"text": 改行できる文字列<br>"file": ファイルアップロードまたは表示できる |
| label | 必須 | 項目の名称、一覧のヘッダー部分に表示する項目 |
| link | null | 別の画面に遷移するＵＲＬ「.../%(pk)s/...」によってtableDataから文字列を置換できる |
| hisotry | name指定の項目 | 変更履歴を表示する<br>配列で他項目の履歴も表示できる |
| help_text | null | 項目の説明文字列 |
| max_width | null | 一覧項目表示最大幅を指定する |
| searchable | false |フィルター検索できるかどうか |
| sortable | false | 並び替えるかどうか |
| visible | true | 一覧またはフォームに表示するかどうか |
| csv | true | CSVに出力するかどうか、visibleがtrueの場合csvを指定してもＣＳＶに出力する<br>visibleがfalseの場合はCSV出力しない、ただし、csvがtrueでvisibleがfalseだとしてもcsv出力はできます |
| read_only | false | フォーム入力用項目。読み込み専用、フォームでは非活性に表示 |
| required | false | フォーム入力用項目。必須項目 |
| max_length | null | フォーム入力用項目。文字入力の長さ制限 |
| regex | null | 入力チェック時、指定の正規表現でチェックを行う |
| default | null | フォーム入力用項目。デフォールトの値。 |
| choices | [] | typeはchoiceまたはchoicesの場合、choicesのリストからデータを選択して表示する<br>[{"value": "値", "display_name": "表示名" }, ...]のように値を設定してください |
| rowStyles |null | 行のスタイル、例{true: {'backgroundColor': 'lightgray'}}は値がtrueの場合に指定したスタイルを設定 |
| variant | null | "type"が"boolean"の場合、["select", "checkbox"]が選択できる。デフォールトはcheckbox、"select"を設定したらはドロップダウンリストとして表示する<br> "type"が"select"の場合、["autocomplete"]が設定したら、フィルター機能を持つドロップダウンリストを表示する。 |
| decimal_digits | null | 小数部分の桁数 |
| min_value | null | typeが"integer", "decimal"時有効、最小値 |
| max_value | null | typeが"integer", "decimal"時有効、最大値 |
| aggregate | null | ["sum", () => (...)]が設定できる。設定したら、一覧の合計を計算して表示する。 <br>EnhancedTableに「showAggregate」がtrueの場合のみ有効|
| step | null | typeが"integer"または "decimal"の場合に有効、標準HTMLのstepと一緒 |
| colStyles | null | 項目のCSSを自由に設定できますfontSize |
| verbose_name | null | typeが"file"時有効、ファイルの名前で、リンクとして表示する、リンクをクリックするとプレビューできます |
| limit | null | ファイルアップロード時サイズ制限(単位: byte)、例：5 * 1024 * 1024 = 5MB
| multiple | false | typeが"file"時有効、ファイルは複数選択できるかどうか |
| handle_download | null | typeが"file"時有効、ファイルのダウンロード処理 |
| cascade_to | null | カスケード先の項目ID |
| cascade_from | null | カスケード元の項目ID<br>使用時 onChange を設定する必要があります |
| get_props | null | 項目の属性を動的に設定できます<br>function (data, inlines) {} で設定します<br>dataはフォームのデータ,　inlinesは複数行の場合のデータ |
| get_value | null | function(value, data) {} 設定した場合、このメソッドから値を取得する |