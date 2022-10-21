import { predict, handInit } from "./handtracking.js";
import websocketInit from "./websocket.js";
const clock = new THREE.Clock();

let scene, camera, renderer;
let arToolkitSource, arToolkitContext;
let mixer;
let animations;
let canvasElement;
let model;
let cloneModel;

threexInit();
function threexInit() {
  websocketInit();
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
    cameraParametersUrl: "data/camera_para.dat",
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

  const markerRoot = new THREE.Group();
  scene.add(markerRoot);

  // カメラの座標は0,0,0
  // markerのpositionのzIndex：奥→手前はマイナス→0
  const arMarkerControls = new THREEx.ArMarkerControls(
    arToolkitContext,
    markerRoot,
    {
      type: "pattern",
      patternUrl: "data/pattern.patt",
    }
  );

  // 3Dモデル読み込み
  const loader = new THREE.GLTFLoader();
  const url = "./dog_walk.glb";

  loader.load(
    url,
    (gltf) => {
      animations = gltf.animations;
      model = gltf.scene;

      // marker lost時のためのコピー
      cloneModel = model.clone();
      cloneModel.visible = false;
      scene.add(cloneModel);

      if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(model);

        for (let i = 0; i < animations.length; i++) {
          const animation = animations[i];
          const action = mixer.clipAction(animation);

          action.play();
        }
      }

      model.scale.set(1.0, 1.0, 1.0);
      model.position.set(0, 0, 0);
      model.rotation.y = Math.PI;
      markerRoot.add(model);
    },
    (err) => {
      console.error(err);
    }
  );

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
        cloneModel.position.set(
          arMarkerControls.object3d.position.x,
          arMarkerControls.object3d.position.y,
          arMarkerControls.object3d.position.z
        );
        cloneModel.visible = false;
      }

      arToolkitContext.update(arToolkitSource.domElement);

      // markerが途切れたらその場に表す処理
      if (
        !visible &&
        !cloneModel.position.equals(new THREE.Vector3(0, 0, 0)) &&
        !cloneModel.visible
      ) {
        cloneModel.visible = true;
        console.log("marker lost");
      }

      // 手の検知
      predict().then((predictions) => {
        // markerが一定以上カメラに近づいていることを判定
        if (predictions?.length > 0 && arMarkerControls.object3d.visible) {
          const distance =
            camera.position.z - arMarkerControls.object3d.position.z;
          if (distance < 5) {
            console.log("too close");
          }
        }
      });
    }

    if (mixer) {
      mixer.update(clock.getDelta());
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

  function changeAnimation(animationNum) {
    mixer.stopAllAction();
    const anime = mixer.clipAction(animations[num]);
    anime.setLoop(THREE.LoopOnce);
    anime.clampWhenFinished = true;

    anime.play();
  }

  function changeModel(modelName) {}
}
