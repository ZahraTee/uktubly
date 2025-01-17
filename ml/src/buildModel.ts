import * as tf from "@tensorflow/tfjs-node";

import { ARABIC_CHARACTER_COUNT } from "./consts";
import { inputFileNameToPath, readCSV, type FileRow } from "./readCsv";

const trainingImagesFileName = "dataset/csvTrainImages_13440x1024.csv";
const trainingLabelsFileName = "dataset/csvTrainLabel_13440x1.csv";
const testingImagesFileName = "dataset/csvTestImages_3360x1024.csv";
const testingLabelsFileName = "dataset/csvTestLabel_3360x1.csv";

async function loadData() {
  const trainingImagesPromise = readCSV(trainingImagesFileName);
  const trainingLabelsPromise = readCSV(trainingLabelsFileName);
  const testingImagesPromise = readCSV(testingImagesFileName);
  const testingLabelsPromise = readCSV(testingLabelsFileName);

  const [trainingImages, trainingLabels, testingImages, testingLabels] =
    await Promise.all([
      trainingImagesPromise,
      trainingLabelsPromise,
      testingImagesPromise,
      testingLabelsPromise,
    ]);

  const trainingData = fileDataToTensors(trainingImages, trainingLabels);
  const testingData = fileDataToTensors(testingImages, testingLabels);

  return { trainingData, testingData };
}

function fileDataToTensors(
  images: FileRow[],
  labels: FileRow[]
): { xs: tf.Tensor4D; ys: tf.Tensor } {
  const processedImages: number[][] = images.map((row) => row.map(Number));
  const processedLabels: number[] = labels.map((row) => Number(row[0]) - 1);

  const exampleCount = images.length;

  return {
    xs: tf
      .tensor4d(processedImages.flat(), [exampleCount, 32, 32, 1], "float32")
      // Normalising the values, which are 0-255 representing grayscale values.
      .div(255),
    ys: tf.oneHot(processedLabels, 28, 1, 0, "float32"),
  };
}

async function main() {
  const { trainingData, testingData } = await loadData();
  const { xs, ys } = trainingData;

  console.info("💿 Loaded and processed datasets...");

  const model = tf.sequential();

  function conv2d(filters: number, kernelSize: [number, number]) {
    return tf.layers.conv2d({
      filters,
      kernelSize,
      activation: "relu",
    });
  }

  model.add(
    tf.layers.conv2d({
      inputShape: [32, 32, 1],
      filters: 32,
      kernelSize: [5, 5],
      activation: "relu",
    })
  );
  model.add(conv2d(32, [5, 5]));
  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
    })
  );
  model.add(
    tf.layers.dropout({
      rate: 0.25,
    })
  );

  model.add(conv2d(64, [3, 3]));
  model.add(conv2d(64, [3, 3]));
  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2],
    })
  );
  model.add(
    tf.layers.dropout({
      rate: 0.25,
    })
  );

  model.add(tf.layers.flatten());
  model.add(
    tf.layers.dense({
      units: 256,
      inputDim: 1024,
      activation: "relu",
    })
  );
  model.add(
    tf.layers.dense({
      units: 256,
      activation: "relu",
    })
  );
  model.add(
    tf.layers.dropout({
      rate: 0.5,
    })
  );
  model.add(
    tf.layers.dense({
      units: ARABIC_CHARACTER_COUNT,
      activation: "softmax",
    })
  );

  model.compile({
    optimizer: tf.train.adam(),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  console.log("👠 Commencing model training...");

  await model.fit(xs, ys, {
    epochs: 20,
    shuffle: true,
    validationData: [testingData.xs, testingData.ys],
  });

  console.log("💾 Training complete! Saving the model...");

  model.save("file://./ahcd");
}

main();
