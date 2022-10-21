// 各アニメーションの変更定義
// アニメーション止まる
const animation_stop = () => {
  console.log("animation stop")
}
// アニメーション歩いている
const animation_walking = () => {
  console.log("animation walking")
}
// アニメーション拾って歩いている状態
const animation_picked = () => {
  console.log("animation picked")
}
// アニメーション撫でた後
const animation_stroked = () => {
  console.log("animation stroked")
}


// socket周りの通信定義
const socket = io();
socket.on('connect', function() {
  console.log("ws connected")
});

socket.on("animate", function(message) {
  console.log(message)
  switch (message) {
    case "stop":
      animation_stop();
      break;
    case "walk":
      animation_walking();
      break;
    case "pick":
      animation_picked();
      break;
    case "stroke":
      animation_stroked();
      break;
    default:
      console.log(`unknown animation: ${message}`)
  }
})
