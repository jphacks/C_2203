# サンプル（プロダクト名）

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2022/08/JPHACKS2022_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
<!-- TODO Refactor -->
**ひとり暮らししていると部屋が散らかってしまいますよね。**
例えば、ゴミ箱を目掛けて投げ入れたティッシュが外れて放置されたままだったり、食べ終えたお菓子の包装紙が落ちていたりしませんか？
そんな**片付けが苦手なあなたのためのペット型ゴミ拾いロボット**です。

### 製品説明（具体的な製品の説明）
<!-- TODO Refactor -->
「*プロダクト名*」は部屋に落ちているゴミを発見すると駆け寄って拾います。
拾ったゴミはあなたの場所まで届けてくれます。
[Webサイト]()上でカメラを起動して見るとAR技術によりあなただけのペットの姿を見ることができます。
その健気な姿に心を打たれあなたはゴミを捨てたくなることでしょう。

**一人暮らしの部屋を片付けられ、一人暮らしの寂しさも紛らわしてくれる**愛くるしい姿の「*プロダクト名*」を体験してみませんか？
### 特長
#### 1. 高精度なゴミ検知
<!-- TODO -->
画像認識で差分検出でエッジ抽出で高精度を実現的な説明でいいかな
#### 2. AR技術を用いたペットとの対話
<!-- TODO -->
AR技術で可愛らしい姿が見えるだけでなく、こちらの撫でるアクションに反応して喜んでくれます。
#### 3. ゴミの回収機構
<!-- TODO -->
アーム機構を自作しました。

### 解決出来ること
<!-- TODO -->
### 今後の展望
<!-- TODO -->
### 注力したこと（こだわり等）
<!-- TODO Refactor -->
* ARを用いたペットとのインタラクティブな対話
  癒しを享受するためには「*プロダクト名*」とのインタラクティブな関係が不可欠であると考えました。
  しかし、現実世界で物理的デバイスと対話するには部屋の空間的制約やハッカソン期間内での時間的制約、金銭的制約などさまざまな壁がありました。
  そこで我々はこれらの制約を無視でき、テーマの「x Tech」にも準ずるAR技術に注目しました。
* ゴミの位置検出
<!-- TODO -->
* 車体の操作
<!-- TODO -->
  Bluetooth介して車体を操作しています。そのため

## 開発技術
### アーキテクチャ
<img src="https://github.com/jphacks/C_2203/blob/feature/readme/documents/architecture.jpg" width="100%">

### 活用した技術
#### フレームワーク・ライブラリ・モジュール・ツール
* サーバー
  * [Flask](https://msiz07-flask-docs-ja.readthedocs.io/ja/latest/)
  * [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/)
* クライアント
  * WebSocket
    * [Socket.IO](https://socket.io/))
  * AR
    * [AR.js](https://ar-js-org.github.io/AR.js-Docs/)
    * [three.js](https://github.com/mrdoob/three.js/)
* ゴミ検出
  * [OpenCV](https://github.com/opencv/opencv-python)
  * [numpy](https://numpy.org/)
* デバイスとの通信
  * [pySerial](https://github.com/pyserial/pyserial)
* モデリング
  * [Blender](https://blender.jp/)

#### デバイス
* ESP-WROOM-32
* カメラ

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 独自で開発したものの内容をこちらに記載してください
* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください。

##### ゴミの検知（画像処理）[commit](https://github.com/jphacks/C_2203/blob/master/image_processing/main.py#L12..L48)
<!-- TODO -->
<img>

##### 電子回路
回路構成（配線含め）を自作しました。
<img src="https://github.com/jphacks/C_2203/blob/master/documents/circuit/circuit.jpg" width="100%">

##### 開閉機構
<!-- TODO -->
<img>
