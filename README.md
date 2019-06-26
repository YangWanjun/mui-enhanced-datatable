### DEMO
https://yangwanjun.github.io/mui-enhanced-datatable/

### Tableの属性
|属性|既定値|説明|
|:---|:---|:---|
|tableHeaderColor|"gray"|["warning", "primary", "danger", "success", "info", "rose", "gray"]
|tableHead|[]|ヘッダーの項目、詳細は下記より説明
|tableData|[]|テーブルのデータ
|rowsPerPage|null|ページサイズ、デフォルトは改頁しない
|tableProps|null|Material UIテーブルの属性

### EnhancedTable
|属性|既定値|説明|
|:---|:---|:---|
|tableActions|[]|ユーザー定義のテーブルの動作、例（レコード追加等）。
|rowActions|[]|ユーザー定義の行ごとの動作、例（レコード編集、削除）。
|selectable|'none'|['none', 'single', 'multiple']は選択できる。
|pk|'id'|行の主キー
|rowsPerPage|10|１ページに表示する行数
|rowsPerPageOptions|[5, 10, 15, 25, 50]|１ページに表示する行数
|server|false|フィルター、ソートなどはサーバー側で処理するのか
|toolbar|true|ツールバーを表示するかどうか
|title|null|テーブル名称
|filters|{}|フィルター項目{項目名：項目値}のＪＳＯＮ
|pushpinTop|0|ヘッダー固定時ヘッダーの高さ
|allowCsv|false|ＣＳＶダウンロード
|urlReflect|false|フィルター、ソート時、ＵＲＬに反映するかどうか

### Tableヘッダーの定義
|属性|既定値|説明|
|:---|:---|:---|
|name|必須|項目名
|type|"string"|文字列として表示する,["string", "integer", "choice", "boolean", ...]などが設定できる
|label|必須|ヘッダーに表示する名称
|maxWidth|null|項目が表示する最大の長さ（単位：ピクセル）
|link|null|別の画面に遷移するＵＲＬ「.../%(pk)s/...」によってtableDataから文字列を置換できる
|choices|[]|typeはchoiceの場合、choicesのリストからデータを選択して表示する
|sortable|false|並び替えるかどうか
|searchable|false|フィルター検索できるかどうか
|variant|null|"boolean"のみ有効、["select", "checkbox"]が選択できる、"select"の場合はドロップダウンリストとして表示する
|visible|true|表示するかどうか
|rowStyles|null|行のスタイル、例{true: {'backgroundColor': 'lightgray'}}は値がtrueの場合に指定したスタイルを設定