import { walk, stop, walkWithBall, stopWithBall } from "./index.js";
// 各アニメーションの変更定義
// アニメーション止まる
const animationStop = () => {
  console.log("animation stop");
  stop();
};
// アニメーション歩いている
const animationWalking = () => {
  console.log("animation walking");
  walk();
};
// アニメーション拾って歩いている状態
const animationWalkingWithBall = () => {
  console.log("animation picked");
  walkWithBall();
};
// アニメーション拾って歩いている状態
const animationStopWithBall = () => {
  console.log("animation picked");
  stopWithBall();
};

// socket周りの通信定義
const socket = io();
sample();
socket.on("connect", function () {
  console.log("ws connected");
});

socket.on("animate", function (message) {
  console.log(message);
  switch (message) {
    case "stop":
      animationStop();
      break;
    case "walk":
      animationWalking();
      break;
    case "stop_with_ball":
      animationStopWithBall();
      break;
    case "walk_with_ball":
      animationWalkingWithBall();
      break;
    default:
      console.log(`unknown animation: ${message}`);
  }
});
