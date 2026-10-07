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

export async function detectLipMovement(
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

  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  const leftCorner = landmarks[61];
  const rightCorner = landmarks[291];

  if (
    !upperLip ||
    !lowerLip ||
    !leftCorner ||
    !rightCorner
  ) {
    return false;
  }

  const mouthOpening = distance(
    upperLip,
    lowerLip
  );

  const mouthWidth = distance(
    leftCorner,
    rightCorner
  );

  if (mouthWidth === 0) {
    return false;
  }

  const mouthRatio =
    mouthOpening / mouthWidth;

  return mouthRatio > 0.12;
}