import { type Editor, exportToBlob, downsizeImage } from "tldraw";
import { INPUT_IMAGE_SIZE } from "./consts";

async function getBlobFromEditor(editor: Editor): Promise<Blob> {
  const shapeIds = Array.from(editor.getCurrentPageShapeIds());

  const blob = await exportToBlob({
    editor,
    ids: Array.from(shapeIds),
    format: "png",
    opts: {
      darkMode: true,
    },
  });

  const downsizedBlob = await downsizeImage(
    blob,
    INPUT_IMAGE_SIZE,
    INPUT_IMAGE_SIZE
  );

  return downsizedBlob;
}

async function blobToRgbPixelData(blob: Blob): Promise<Uint8ClampedArray> {
  const canvas = new OffscreenCanvas(INPUT_IMAGE_SIZE, INPUT_IMAGE_SIZE);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(" Unable to get offscreen canvas context");
  }

  const imageBitmap = await createImageBitmap(blob);

  context.save();
  context.translate(32 / 2, 32 / 2);
  context.rotate((270 * Math.PI) / 180);
  context.drawImage(imageBitmap, -32 / 2, -32 / 2, 32, 32);
  const imageData = context.getImageData(0, 0, 32, 32);
  context.restore();
  imageBitmap.close();

  return imageData.data;
}

function processPixelData(rgbaPixels: Uint8ClampedArray): number[] {
  const grayscaleImageData = [];

  for (let i = 0; i < rgbaPixels.length / 4; i += 1) {
    const grayscaleValue = rgbaPixels[i * 4];
    const thresholdedValue = grayscaleValue > 128 ? 255 : 0;
    grayscaleImageData[i] = thresholdedValue;
  }

  return grayscaleImageData;
}

export async function convertEditorContentsToModelInput(editor: Editor) {
  const blob = await getBlobFromEditor(editor);
  const rgbaPixels = await blobToRgbPixelData(blob);
  const grayscalePixels = processPixelData(rgbaPixels);
  return grayscalePixels;
}
