# サンプル（プロダクト名）

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2022/08/JPHACKS2022_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
<!-- TODO Refactor -->
**ひとり暮らししていると部屋が散らかってしまいますよね。**
例えば、ゴミ箱を目掛けて投げ入れたティッシュが外れて放置されたままだったり、食べ終えたお菓子の包装紙が落ちていたりしませんか？
そんな**片付けが苦手なあなたのためのペット型ゴミ拾いロボット**です。

### 製品説明（具体的な製品の説明）
「*プロダクト名*」は床に散らかったゴミを検知し回収にしてくれます。
加えて専用のWebサイトからカメラを通じて「*プロダクト名*」を見るとARにより可愛らしい犬の姿が浮かび上がります。

#### 車体
車体にはモーターを3つ使用し、そのうち2つを車輪に1つをゴミ拾いアームに使用しています。
車輪は正回転、逆回転可能で前進・後進・車体の中心を軸にした左・右回転をすることが可能です。
アームはモーターが半回転すると閉じ、もう半回転すると開きます。
モーターの制御にはESP-WROOM-32というマイコンを使用しており、ゴミを検出するとゴミ解析PCからBluetoothを介して車体の操作命令を送っています。

また装飾にもこだわり、ハードウェアの圧迫感を全く感じさせないようにしました。
<img src="https://github.com/jphacks/C_2203/blob/master/documents/car.jpg" width="70%">

#### AR用Webサイト
Webサイトでは「*プロダクト名*」の状態に応じでARアニメーションが表示されます。
アニメーションには「歩く」「とまる」「ゴミを持って歩く」「ゴミを持ってとまる」「喜ぶ」の4種類が実装済みです。
「喜ぶ」アニメーションはサイトから「*プロダクト名*」を撫でることで発火されます。
撫でて喜ぶ、このインタラクティブな関係によりユーザーは癒やされること間違い無いでしょう。
<img>

### 特長
#### 1. 高精度なゴミ検知
散らかったゴミの位置を正確に測定します。
ゴミの拾い漏れを限りなく減らすことができ、部屋をきれいに保つことができます。
#### 2. AR技術を用いたペットとの対話
一人暮らしの寂しさを紛らわすための癒しを享受するためには「*プロダクト名*」とのインタラクティブな関係が不可欠であると考えました。
ARで可愛らしい姿が見えるのはもちろんのこと、**Web上で撫でると実際のペットのように反応して喜んでくれます**。

### 解決出来ること
「*プロダクト名*」は部屋に落ちているゴミを発見すると駆け寄って拾います。
拾ったゴミをあなたまで届けてくれます。
さらに[Webサイト]()上でカメラを起動して見るとAR技術によりあなただけのペットの姿を見ることができます。
その健気な姿に心を打たれあなたはゴミを捨てたくなることでしょう。

「*プロダクト名*」を使用することで、**一人暮らしの部屋を片付けられ、一人暮らしの寂しさも紛らわしてくれます**
### 今後の展望
<!-- TODO -->
### 注力したこと（こだわり等）
  <!-- TODO Refactor -->
* **ゴミの位置検出**
  床にゴミが散らかると差分を検出によりゴミの位置を正確に測定します。実装はOpenCVを用いて独自のロジックを考えました。
* **ARを用いたペットとのインタラクティブな対話**
* **車体の操作**
  Bluetooth介して車体をゴミの位置まで操作しています。
* **アニメーションの切り替え**
  またゴミを見つけ動き出す/ゴミを回収するとブラウザで閲覧しているARアニメーションが切り替わります。アニメーションの切り替えにはWebsocketを使用し、サーバーとブラウザ間で双方向通信を実現しています。
  <img><img><img><!-- animationの画像 -->

## 開発技術
### アーキテクチャ
<img src="https://github.com/jphacks/C_2203/blob/master/documents/architecture.jpg" width="100%">

### 活用した技術
#### フレームワーク・ライブラリ・モジュール・ツール
* サーバー
  * [Flask](https://msiz07-flask-docs-ja.readthedocs.io/ja/latest/)
  * [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/)
* クライアント
  * WebSocket
    * [Socket.IO](https://socket.io/)
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
* モーター
* カメラ

### 独自技術
#### ハッカソンで開発した独自機能・技術
##### ゴミの検知（画像処理）[実装箇所](https://github.com/jphacks/C_2203/blob/master/image_processing/main.py#L12..L48)
<img>

##### 電子回路
<img src="https://github.com/jphacks/C_2203/blob/master/documents/circuit/circuit.jpg" width="100%">
