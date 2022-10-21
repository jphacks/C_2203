# サンプル（プロダクト名）

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2022/08/JPHACKS2022_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要
### 背景(製品開発のきっかけ、課題等）

**ひとり暮らししていると部屋が散らかってしまいますよね。**
例えば、ゴミ箱を目掛けて投げ入れたティッシュが外れて放置されたままだったり、食べ終えたお菓子の包装紙が落ちていたりしませんか？
そんな**片付けが苦手なあなたのためのペット型ゴミ拾いロボット**です。

### 製品説明（具体的な製品の説明）
「*プロダクト名*」は部屋に落ちているゴミを発見すると駆け寄って拾います。
拾ったゴミはあなたの場所まで届けてくれます。
[Webサイト]()上でカメラを起動して見るとAR技術によりあなただけのペットの姿を見ることができます。
その健気な姿に心を打たれあなたはゴミを捨てたくなることでしょう。

**一人暮らしの部屋を片付けられ、一人暮らしの寂しさも紛らわしてくれる**愛くるしい姿の「*プロダクト名*」を体験してみませんか？
### 特長
#### 1. 特徴1
#### 2. 特長2
#### 3. 特長3

### 解決出来ること
### 今後の展望
### 注力したこと（こだわり等）
* ARを用いたペットとのインタラクティブな対話
  癒しを享受するためには「*プロダクト名*」とのインタラクティブな関係が不可欠であると考えました。
  しかし、現実世界で物理的デバイスと対話するには部屋の空間的制約やハッカソン期間内での時間的制約、金銭的制約などさまざまな壁がありました。
  そこで我々はこれらの制約を無視でき、テーマの「x Tech」にも準ずるAR技術に注目しました。
* ゴミの位置検出
* 車体の操作
  Bluetooth介して車体を操作しています。そのため

## 開発技術
### アーキテクチャ
<img src="https://github.com/jphacks/C_2203/blob/feature/readme/documents/architecture.jpg" width="100">

### 活用した技術
- 
#### API・データ
* 
* 

#### フレームワーク・ライブラリ・モジュール・ツール
* サーバー
  * [Flask](https://msiz07-flask-docs-ja.readthedocs.io/ja/latest/)
  * [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/)
* クライアント
  * WebSocket
    * [Socket.IO](https://socket.io/)
  * 手の検出
    * [tensorflow.js](https://github.com/tensorflow/tfjs-models) ( [hand-pose-detection](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection) )
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

* ゴミの検知（画像処理）
* 電子回路
* 開閉機構

#### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* 
* 
