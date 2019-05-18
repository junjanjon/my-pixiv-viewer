# my-pixiv-viewer

https://github.com/junjanjon/pixiv_client_mechanize (現在 close) と連携して pixiv を見るツールです

## Usage

### 初回設定

npm でインストールする。

```
git clone git@github.com:junjanjon/my-pixiv-viewer.git
cd my-pixiv-viewer
npm install
```

### electoron を起動する

```
npm run electoron .
```

### ディレクトリを設定する

初回はメニューの [File] => [Open] でディレクトリを選ぶ必要があります。

[pixiv_client_mechanize](https://github.com/junjanjon/pixiv_client_mechanize) のダウンロード先ディレクトリの想定です。

![サンプル](readme_images/sample.jpg)

## 操作方法

|key|デフォルトサイズモード|フルサイズモード|
|:-|:-|:-|
|j|1枚　次に移動する|下へ画像スクロール|
|k|1枚　前に移動する|上へ画像スクロール|
|h|次の区切り に移動する　|左へ画像スクロール|
|l|前の区切り に移動する|右へ画像スクロール|
|f|フルサイズで表示する|デフォルトサイズで表示する|
|d|デフォルトサイズで表示する|デフォルトサイズで表示する|

## Contribute

バグ報告や要望などはIssuesにお願いいたします。プルリクもお待ちしています。

## License

このソフトウェアは[MIT License](LICENSE)のもとでリリースされています。
