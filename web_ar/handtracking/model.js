const clock = new THREE.Clock();

let scene, camera, renderer;
let arToolkitSource, arToolkitContext;
let mixer;
let canvasElement;

init();
async function init() {
  await threexInit();
  handTracking();
}
function threexInit() {
  scene = new THREE.Scene();

  camera = new THREE.Camera();
  scene.add(camera);

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 5, 0);
  scene.add(ambientLight);
  scene.add(directionalLight);

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

  function handleResize() {
    arToolkitSource.onResize();
    arToolkitSource.copySizeTo(renderer.domElement);

    if (arToolkitContext.arController) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
    }
  }

  arToolkitSource.init(() => {
    setTimeout(() => {
      tick();
      handleResize();
      [].slice.call(document.querySelectorAll(".invisible")).forEach((elm) => {
        elm.classList.remove("invisible");
      });
    }, 200);
  });

  window.addEventListener("resize", handleResize, {
    passive: true,
  });

  const markerRoot = new THREE.Group();

  scene.add(markerRoot);

  const arMarkerControls = new THREEx.ArMarkerControls(
    arToolkitContext,
    markerRoot,
    {
      type: "pattern",
      patternUrl: "data/pattern.patt",
    }
  );

  const loader = new THREE.GLTFLoader();
  const url = "./dog_walk.glb";

  loader.load(
    url,
    (gltf) => {
      const animations = gltf.animations;
      const model = gltf.scene;

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
      markerRoot.add(gltf.scene);
    },
    (err) => {
      console.error(err);
    }
  );
}

function update() {
  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
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

async function handTracking() {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: "mediapipe",
    modelType: "full",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  };
  detector = await handPoseDetection.createDetector(model, detectorConfig);

  const video = document.getElementById("input-video");
  console.log(video);

  const hands = video && (await detector.estimateHands(video));

  const canvas = document.getElementById("output_canvas");
  const csx = canvas.getContext("2d");

  drawHand(hands, csx);
}

// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Infinity Gauntlet Style
const style = {
  0: { color: "yellow", size: 15 },
  1: { color: "gold", size: 6 },
  2: { color: "green", size: 10 },
  3: { color: "gold", size: 6 },
  4: { color: "gold", size: 6 },
  5: { color: "purple", size: 10 },
  6: { color: "gold", size: 6 },
  7: { color: "gold", size: 6 },
  8: { color: "gold", size: 6 },
  9: { color: "blue", size: 10 },
  10: { color: "gold", size: 6 },
  11: { color: "gold", size: 6 },
  12: { color: "gold", size: 6 },
  13: { color: "red", size: 10 },
  14: { color: "gold", size: 6 },
  15: { color: "gold", size: 6 },
  16: { color: "gold", size: 6 },
  17: { color: "orange", size: 10 },
  18: { color: "gold", size: 6 },
  19: { color: "gold", size: 6 },
  20: { color: "gold", size: 6 },
};

// Drawing function
const drawHand = (predictions, ctx) => {
  // Check if we have predictions
  if (predictions.length > 0) {
    // Loop through each prediction
    predictions.forEach((prediction) => {
      // Grab landmarks
      const landmarks = prediction.landmarks;

      // Loop through fingers
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j];
        //  Loop through pairs of joints
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          // Draw path
          ctx.beginPath();
          ctx.moveTo(
            landmarks[firstJointIndex][0],
            landmarks[firstJointIndex][1]
          );
          ctx.lineTo(
            landmarks[secondJointIndex][0],
            landmarks[secondJointIndex][1]
          );
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // Loop through landmarks and draw em
      for (let i = 0; i < landmarks.length; i++) {
        // Get x point
        const x = landmarks[i][0];
        // Get y point
        const y = landmarks[i][1];
        // Start drawing
        ctx.beginPath();
        ctx.arc(x, y, style[i]["size"], 0, 3 * Math.PI);

        // Set line color
        ctx.fillStyle = style[i]["color"];
        ctx.fill();
      }
    });
  }
};
