import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";
import { DefaultSizeStyle, Tldraw, type Editor } from "tldraw";
import "tldraw/tldraw.css";
import "./App.css";
import { LetterBoard } from "./components/LetterBoard";
import { ARABIC_CHARACTERS_COUNT, INPUT_IMAGE_SIZE } from "./consts";
import { convertEditorContentsToModelInput } from "./imageProcessing";

type Tool = "draw" | "eraser";

function App() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("draw");

  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const [prediction, setPrediction] = useState<number | null>(null);
  const [alreadySeen, setAlreadySeen] = useState<boolean>(false);
  const [seenLetters, setSeenLetters] = useState<boolean[]>(
    new Array(ARABIC_CHARACTERS_COUNT).fill(false)
  );

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
    if (!model || !editor) {
      return;
    }

    const inputImageData = await convertEditorContentsToModelInput(editor);

    const inputTensor = tf
      .tensor4d(
        inputImageData,
        [1, INPUT_IMAGE_SIZE, INPUT_IMAGE_SIZE, 1],
        "float32"
      )
      .div(255);

    const outputTensor = model.predict(inputTensor) as tf.Tensor;
    const prediction = await outputTensor.data();
    const processedPrediction = Array.from(prediction).map(Math.round);

    // This is one-indexed.
    const letterIndex = processedPrediction.indexOf(1);
    setPrediction(letterIndex);
    setAlreadySeen(seenLetters[letterIndex]);

    if (!seenLetters[letterIndex] && letterIndex !== -1) {
      setSeenLetters((prev) => {
        const newSeenLetters = [...prev];
        newSeenLetters.splice(letterIndex, 1, true);
        return newSeenLetters;
      });
    }
  }

  const hasPredictionError = prediction === -1;

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
    <main>
      <h1>Uktubly</h1>
      <p>✏️ Write an Arabic letter...</p>
      <div className="action-area">
        <div className="drawing-area">
          <div className="canvas">
            <Tldraw
              hideUi
              inferDarkMode
              onMount={(editor) => {
                setEditor(editor);
                editor.setCurrentTool(selectedTool);
                // Set up a thick brush
                editor.setStyleForNextShapes(DefaultSizeStyle, "xl");
              }}
            />{" "}
          </div>
          <div className="toolbar">
            <button onClick={() => toggleSelectedTool()}>
              {selectedTool === "draw" ? "Erase" : "Draw"}
            </button>
            <button onClick={clearCanvas}>Clear</button>
            <button onClick={onSubmit}>Submit</button>
          </div>
        </div>

        <div className="results-area">
          <LetterBoard seenStatus={seenLetters} />
          <p
            className={
              hasPredictionError || alreadySeen ? "error" : "hidden-error"
            }
          >
            {hasPredictionError
              ? "Oops, couldn't identify that. Try again?"
              : "Already got that one!"}
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;
