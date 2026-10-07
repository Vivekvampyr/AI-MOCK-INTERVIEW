import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";

const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

let faceLandmarker: FaceLandmarker | null = null;

async function getFaceLandmarker() {
  if (faceLandmarker) {
    return faceLandmarker;
  }

  const vision = await FilesetResolver.forVisionTasks(
    WASM_PATH
  );

  faceLandmarker =
    await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_PATH,
      },
      runningMode: "VIDEO",
      numFaces: 1,
    });

  return faceLandmarker;
}

function distance(
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getEyeRatio(
  landmarks: Array<{ x: number; y: number }>,
  irisIndex: number,
  leftCornerIndex: number,
  rightCornerIndex: number
) {
  const iris = landmarks[irisIndex];
  const leftCorner = landmarks[leftCornerIndex];
  const rightCorner = landmarks[rightCornerIndex];

  if (!iris || !leftCorner || !rightCorner) {
    return null;
  }

  const eyeWidth = distance(leftCorner, rightCorner);

  if (eyeWidth === 0) {
    return null;
  }

  return {
    x: distance(leftCorner, iris) / eyeWidth,
  };
}

export async function detectEyeMovement(
  video: HTMLVideoElement
) {
  const detector = await getFaceLandmarker();

  if (
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    video.videoWidth === 0 ||
    video.videoHeight === 0
  ) {
    return false;
  }

  const result = detector.detectForVideo(
    video,
    performance.now()
  );

  if (!result.faceLandmarks.length) {
    return false;
  }

  const landmarks = result.faceLandmarks[0];

  const leftEye = getEyeRatio(
    landmarks,
    468,
    33,
    133
  );

  const rightEye = getEyeRatio(
    landmarks,
    473,
    362,
    263
  );

  if (!leftEye || !rightEye) {
    return false;
  }

  const averageX =
    (leftEye.x + rightEye.x) / 2;

  return (
    averageX < 0.35 ||
    averageX > 0.65
  );
}