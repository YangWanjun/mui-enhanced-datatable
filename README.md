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

### Tableヘッダーの定義
|属性|既定値|説明|
|:---|:---|:---|
|name|必須|項目名
|type|"string"|文字列として表示する,["string", "integer", "choice", ...]などが設定できる
|label|必須|ヘッダーに表示する名称
|maxWidth|null|項目が表示する最大の長さ（単位：ピクセル）
|link|null|別の画面に遷移するＵＲＬ「.../%(pk)s/...」によってtableDataから文字列を置換できる
|choices|[]|typeはchoiceの場合、choicesのリストからデータを選択して表示する