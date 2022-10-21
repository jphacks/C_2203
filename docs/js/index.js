import { predict, handInit } from "./handtracking.js";
const clock = new THREE.Clock();

let scene, camera, renderer;
let arToolkitSource, arToolkitContext, arMarkerControls;
let markerRoot;
let canvasElement;

// model関連
let models = {
  walk: {
    url: "./data/dog.glb",
    model: null,
    mixer: null,
    animations: null,
  },
  withBall: {
    url: "./data/dog_ball.glb",
    model: null,
    mixer: null,
    animations: null,
  },
  withHeart: {
    url: "./data/dog_heart.glb",
    model: null,
    mixer: null,
    animations: null,
  },
};
let currentModelName;
let cloneCurrentModel;

threexInit();
function threexInit() {
  scene = new THREE.Scene();

  // カメラ
  camera = new THREE.Camera();
  scene.add(camera);

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 5, 0);
  scene.add(ambientLight);
  scene.add(directionalLight);

  // 出力先指定
  canvasElement = document.getElementById("output_canvas");
  console.log(canvasElement);
  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.GammaEncoding;

  document.body.appendChild(renderer.domElement);

  // threejsベースのarjsを設定
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "./data/camera_para.dat",
    detectionMode: "mono",
  });

  arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
    displayWidth: window.innerWidth,
    displayHeight: window.innerHeight,
  });

  arToolkitSource.init(() => {
    setTimeout(async () => {
      await handInit();
      tick();
      handleResize();
      [].slice.call(document.querySelectorAll(".invisible")).forEach((elm) => {
        elm.classList.remove("invisible");
      });
    }, 1000);
  });

  window.addEventListener("resize", handleResize, {
    passive: true,
  });

  markerRoot = new THREE.Group();
  scene.add(markerRoot);

  // カメラの座標は0,0,0
  // markerのpositionのzIndex：奥→手前はマイナス→0
  arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: "pattern",
    patternUrl: "./data/pattern.patt",
  });

  loadModels().then(() => {
    initModel("walk");
  });
  console.log(models);
}
async function loadModels() {
  // 3Dモデル読み込み
  const loader = new THREE.GLTFLoader();

  for (const [_, v] of Object.entries(models)) {
    const model = await loader.loadAsync(v.url);
    v.animations = await model.animations;
    v.model = await model.scene;
    console.log(v);

    if (v.animations && v.animations.length) {
      v.mixer = new THREE.AnimationMixer(v.model);

      const animation = v.animations[0];
      const action = v.mixer.clipAction(animation);

      action.play();
    }

    v.model.scale.set(1.0, 1.0, 1.0);
    v.model.position.set(0, 0, 0);
    v.model.rotation.y = Math.PI;
  }
}

function initModel(modelName) {
  currentModelName = modelName;
  console.log(models["walk"]);
  // marker lost時のためのコピー
  cloneModel(models[modelName].model);

  models[modelName].mixer.stopAllAction();

  markerRoot.add(models[modelName].model);
}

function cloneModel(model) {
  cloneCurrentModel = model.clone();
  cloneCurrentModel.visible = false;
  scene.add(cloneCurrentModel);
}

function handleResize() {
  arToolkitSource.onResize();
  arToolkitSource.copySizeTo(renderer.domElement);

  if (arToolkitContext.arController) {
    arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
  }
}

function update() {
  if (arToolkitSource.ready) {
    const visible = arMarkerControls.object3d.visible;
    if (visible) {
      cloneCurrentModel.position.set(
        arMarkerControls.object3d.position.x,
        arMarkerControls.object3d.position.y,
        arMarkerControls.object3d.position.z
      );
      cloneCurrentModel.visible = false;
    }

    arToolkitContext.update(arToolkitSource.domElement);

    // markerが途切れたらその場に表す処理
    if (
      !visible &&
      cloneCurrentModel &&
      !cloneCurrentModel.position?.equals(new THREE.Vector3(0, 0, 0)) &&
      !cloneCurrentModel.visible
    ) {
      cloneCurrentModel.visible = true;
      console.log("marker lost");
    }

    // 手の検知
    predict().then((predictions) => {
      // markerが一定以上カメラに近づいていることを判定
      if (predictions?.length > 0 && arMarkerControls.object3d.visible) {
        const distance =
          camera.position.z - arMarkerControls.object3d.position.z;
        if (distance < 6) {
          stroke();
        }
      }
    });
  }

  if (models[currentModelName]?.mixer) {
    models[currentModelName].mixer.update(clock.getDelta());
  }
}

function render() {
  renderer.render(scene, camera);
}

function tick() {
  update();
  render();
  requestAnimationFrame(tick);
}

function stopAnimation() {
  models[currentModelName].mixer.stopAllAction();
}

function changeAnimation(animationNum) {
  stopAnimation();
  const anime = models[currentModelName].mixer.clipAction(
    models[currentModelName].animations[animationNum]
  );
  console.log(anime);

  anime.play();
}

function changeModel(modelName) {
  if (currentModelName == modelName) {
    return;
  }
  markerRoot.remove(models[currentModelName].model);
  currentModelName = modelName;

  const model = models[modelName].model;
  cloneModel(model);
  markerRoot.add(model);
}

export function walk() {
  changeModel("walk");
  changeAnimation(0);
}

export function stop() {
  changeModel("walk");
  stopAnimation();
}

export function walkWithBall() {
  changeModel("withBall");
  changeAnimation(0);
}

export function stopWithBall() {
  changeModel("withBall");
  stopAnimation();
}

function stroke() {
  if (currentModelName == "withHeart") {
    return;
  }
  changeModel("withHeart");
  changeAnimation(1);
  console.log("stroke");
}
