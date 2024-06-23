import { useEffect, useRef, useState } from "react";
import {
  Tldraw,
  exportToBlob,
  type Editor,
  downsizeImage,
  DefaultSizeStyle,
} from "tldraw";
import * as tf from "@tensorflow/tfjs";
import "tldraw/tldraw.css";
import "./App.css";
import { ARABIC_CHARACTERS_AR } from "./consts";

type Tool = "draw" | "eraser";

function App() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("draw");
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (model || isModelLoading) {
      return;
    }

    setIsModelLoading(true);

    async function loadModel() {
      const loadedModel = await tf.loadLayersModel("/ahcd/model.json");
      setIsModelLoading(false);
      setModel(loadedModel);
      console.log("Model loaded!");
    }

    loadModel();
  }, [model, isModelLoading]);

  async function onSubmit() {
    const canvasContext = canvasRef.current?.getContext("2d");

    if (!model || !editor || !canvasContext) {
      return;
    }

    const shapeIds = Array.from(editor.getCurrentPageShapeIds());

    const blob = await exportToBlob({
      editor,
      ids: Array.from(shapeIds),
      format: "png",
      opts: {
        darkMode: true,
      },
    });

    const downsizedBlob = await downsizeImage(blob, 32, 32);
    const imageBitmap = await createImageBitmap(downsizedBlob);

    canvasContext.clearRect(0, 0, 32, 32);
    canvasContext.save();
    canvasContext.translate(32 / 2, 32 / 2);
    canvasContext.rotate((270 * Math.PI) / 180);
    canvasContext!.drawImage(imageBitmap, -32 / 2, -32 / 2, 32, 32);
    const imageData = canvasContext!.getImageData(0, 0, 32, 32);
    canvasContext.restore();
    imageBitmap.close();

    const pixels = imageData.data;

    const grayscaleImageData = [];

    for (let i = 0; i < pixels.length / 4; i += 1) {
      const grayscaleValue = pixels[i * 4];
      const thresholdedValue = grayscaleValue > 128 ? 255 : 0;
      grayscaleImageData[i] = thresholdedValue;
    }

    const inputTensor = tf
      .tensor4d(grayscaleImageData, [1, 32, 32, 1], "float32")
      .div(255);

    const outputTensor = model.predict(inputTensor) as tf.Tensor;
    const prediction = await outputTensor.data();
    const processedPrediction = Array.from(prediction).map(Math.round);

    const letterIndex = processedPrediction.indexOf(1);

    const predictedLetter =
      letterIndex === -1
        ? "Oops... couldn't identify that"
        : ARABIC_CHARACTERS_AR[letterIndex - 1];

    setPrediction(predictedLetter);
  }

  function toggleSelectedTool(forceDraw?: true) {
    let newTool: Tool = "draw";

    if (selectedTool === "draw" && !forceDraw) {
      newTool = "eraser";
    }

    setSelectedTool(newTool);
    editor?.setCurrentTool(newTool);
  }

  function clearCanvas() {
    const currentShapeIds = editor?.getCurrentPageShapeIds();
    const hasDrawing = currentShapeIds?.size ?? 0 > 0;
    if (currentShapeIds && hasDrawing) {
      editor?.deleteShapes(Array.from(currentShapeIds));
      toggleSelectedTool(true);
    }
    setPrediction(null);
  }

  return (
    <>
      <h1>Uktubly</h1>
      <p>✏️ Write an Arabic letter</p>
      <div className="drawing-area">
        <Tldraw
          hideUi
          onMount={(editor) => {
            setEditor(editor);
            editor.setCurrentTool(selectedTool);
            // Set up a thick brush
            editor.setStyleForNextShapes(DefaultSizeStyle, "xl");
          }}
        />
      </div>

      <div className="toolbar">
        <button onClick={() => toggleSelectedTool()}>
          {selectedTool === "draw" ? "Erase" : "Draw"}
        </button>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={onSubmit}>Submit</button>
      </div>
      <span className="prediction">{prediction}</span>
      {/* TODO: replace with OffscreenCanvas */}
      <canvas ref={canvasRef} width={32} height={32} />
    </>
  );
}

export default App;
