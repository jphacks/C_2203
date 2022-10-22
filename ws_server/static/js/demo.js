import {
  models,
  arMarkerControls,
  walk,
  stop,
  walkWithBall,
  stopWithBall,
  stroke,
} from "./threeX.js";

let demoStart = false;

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}
setInterval(() => {
  if (
    models.withHeart.model &&
    arMarkerControls.object3d.visible &&
    !demoStart
  ) {
    demoStart = true;
    sleep(1000)
      .then(() => {
        walk();
        return sleep(3000);
      })
      .then(() => {
        stop();
        return sleep(3000);
      })
      .then(() => {
        walkWithBall();
        return sleep(3000);
      })
      .then(() => {
        stopWithBall();
        return sleep(3000);
      })
      .then(() => {
        stroke();
        return sleep(3000);
      })
      .then(() => {
        stop();
        return sleep(3000);
      });
  }
}, 3000);
