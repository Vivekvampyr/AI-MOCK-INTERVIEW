import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

let model: cocoSsd.ObjectDetection | null = null;
let backendInitialized = false;

async function initializeBackend() {
  if (backendInitialized) return;

  await tf.setBackend("webgl");
  await tf.ready();

  console.log("TensorFlow backend:", tf.getBackend());

  backendInitialized = true;
}

async function getModel() {
  await initializeBackend();

  if (model) return model;

  console.log("Loading COCO-SSD model...");

  model = await cocoSsd.load({
    base: "mobilenet_v2",
  });

  console.log("COCO-SSD model loaded");

  return model;
}

export async function detectSmartDevice(video: HTMLVideoElement) {
  const detector = await getModel();

  if (
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    video.videoWidth === 0 ||
    video.videoHeight === 0
  ) {
    return null;
  }

  const predictions = await detector.detect(video, 10, 0.3);

  console.log(
    "COCO predictions:",
    predictions.map((p) => ({
      class: p.class,
      score: p.score,
    }))
  );

  const phone = predictions.find(
    (prediction) =>
      prediction.class === "cell phone" &&
      prediction.score >= 0.3
  );

  return phone ? phone.score : null;
}