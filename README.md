# ひろうけん(c_2203)

[![hiroken](https://github.com/jphacks/C_2203/blob/master/documents/car.jpg)](https://drive.google.com/file/d/1vhDaGj3s5i1kK3Fb4spqDCBEw3eVKLR5/view?usp=sharing)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
**ひとり暮らししていると部屋が散らかってしまいますよね？**
例えば、ゴミ箱を目掛けて投げ入れたティッシュが外れて放置されたままだったり、食べ終えたお菓子の包装紙が落ちていたりしませんか？
そんな**片付けが苦手なあなたのためのペット型ゴミ拾いロボット**です。

### 製品説明（具体的な製品の説明）
**「ひろうけん」** は床に散らかったゴミを検知し回収にしてくれます。
加えて専用のWebサイトからカメラを通じて **「ひろうけん」** を見るとARにより可愛らしい犬の姿が浮かび上がります。

#### 車体
車体にはモーターを3つ使用し、そのうち2つを車輪に、1つをゴミ拾いアームに使用しています。
車輪は正回転、逆回転可能で前進・後進・車体の中心を軸にした左・右回転をすることが可能です。
アームはモーターが半回転すると閉じ、もう半回転すると開きます。
モーターの制御にはESP-WROOM-32というマイコンを使用しており、**ゴミを検出するとゴミ解析PCからBluetoothを介して車体の操作**しています。

また**装飾にもこだわり、ハードウェアの圧迫感を全く感じさせない**ようにしました。
<img src="https://github.com/jphacks/C_2203/blob/master/documents/car_all.jpg" width="70%">

#### AR用Webサイト
Webサイトでは **「ひろうけん」の状態に応じでARアニメーションが表示** されます。
アニメーションには「歩く」「とまる」「ゴミを持って歩く」「ゴミを持ってとまる」「喜ぶ」の4種類が実装済みです。
「喜ぶ」アニメーションはサイトから **「ひろうけん」** を撫でることで発火されます。
撫でて喜ぶ、このインタラクティブな関係によりユーザーは癒やされること間違い無いでしょう。
<img src="https://github.com/jphacks/C_2203/blob/master/documents/ar_dogs/all.png" width="100%">

### 特長
#### 1. 散らかったゴミを回収してくれます。
正確なゴミ回収を行えるため、ゴミが散乱しがちでもすぐに回収して部屋を快適に保ってくれます。
#### 2. AR技術を用いたペットとの対話が可能です。
一人暮らしの寂しさを紛らわすための癒しを享受するためには他者とのインタラクティブな関係が不可欠であると考えました。
ARで可愛らしい姿が見えるのはもちろんのこと、**Web上で撫でると実際のペットのように反応して喜んでくれます**。

### 解決出来ること
**「ひろうけん」** を使用することで、**一人暮らしの部屋を片付けられ、一人暮らしの寂しさも紛らわしてくれます**
### 今後の展望
- 対話機能
  - 名前等を登録できるようにし、声をかけると鳴き声を返したい。
  - リアクションを増やしたい。
- 画像解析処理をPCからラズパイなどのマイコンに移行したい。
  - 一般ユーザーの所持PCとの接続はポータビリティに欠けるため。
- AR読み取り精度の向上
### 注力したこと（こだわり等）
  <!-- TODO Refactor -->
* **正確なゴミの位置検出を実現しました。**
* **全方向回転可能な車を作成しました。どこでも柔軟に移動することが可能です。**
* **可愛さを追求したARアニメーションを実装しました。癒やされること間違いないでしょう。**
* **できるだけ回路をむき出しにしないハードウェアの設計を行いました。ギークな要素が排除できただただ可愛い車体を作成しました。**


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
床にゴミが置かれると差分を検出によりゴミの位置を正確に測定します。実装はOpenCVを用いて独自のロジックを考えました。
<img src="https://github.com/jphacks/C_2203/blob/master/documents/image_processing.png" width="100%">

##### 電子回路
全ての電子回路を独自に作成しました。
<img src="https://github.com/jphacks/C_2203/blob/master/documents/circuit/circuit.jpg" width="100%">
