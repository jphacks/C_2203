let detector;
let videoEl;

export async function handInit() {
  // let videoEl = document.getElementById("input_video");
  videoEl = document.getElementById("arjs-video");
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  };
  detector = await handPoseDetection.createDetector(model, detectorConfig);
}

export async function predict() {
  const predictions = await detector.estimateHands(videoEl, {});
  return predictions;
}
