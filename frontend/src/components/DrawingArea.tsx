import * as tf from "@tensorflow/tfjs";

import { useEffect, useState } from "react";
import { DefaultSizeStyle, Tldraw, type Editor } from "tldraw";
import { ARABIC_CHARACTERS_AR, INPUT_IMAGE_SIZE } from "../utils/consts";
import { convertEditorContentsToModelInput } from "../utils/imageProcessing";
import { Button } from "./Button";

type PredictedIndex = keyof typeof ARABIC_CHARACTERS_AR;

interface Props {
  onClear: () => void;
  onSubmit: (predictedIndex: PredictedIndex) => void;
}

export function DrawingArea({
  onClear: postClear,
  onSubmit: postSubmit,
}: Props) {
  type Tool = "draw" | "eraser";

  const [editor, setEditor] = useState<Editor | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("draw");

  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

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

  const toggleSelectedTool = (forceDraw?: true) => {
    let newTool: Tool = "draw";

    if (selectedTool === "draw" && !forceDraw) {
      newTool = "eraser";
    }

    setSelectedTool(newTool);
    editor?.setCurrentTool(newTool);
  };

  const onClear = () => {
    const currentShapeIds = editor?.getCurrentPageShapeIds();
    const hasDrawing = currentShapeIds?.size ?? 0 > 0;
    if (currentShapeIds && hasDrawing) {
      editor?.deleteShapes(Array.from(currentShapeIds));
      toggleSelectedTool(true);
    }
    postClear();
  };

  const onSubmit = async () => {
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

    postSubmit(processedPrediction.indexOf(1));
  };

  return (
    <div className="drawing-area">
      <div className="canvas">
        <Tldraw
          hideUi
          inferDarkMode
          onMount={(editor) => {
            setEditor(editor);
            editor.setCurrentTool(selectedTool);
            editor.setCameraOptions({
              wheelBehavior: "none",
            });
            // Set up a thick brush
            editor.setStyleForNextShapes(DefaultSizeStyle, "xl");
          }}
        />
      </div>
      <div className="toolbar">
        <Button onClick={() => toggleSelectedTool()}>
          {selectedTool === "draw" ? (
            <>
              <span>Erase</span>
            </>
          ) : (
            <>
              <span>Draw</span>
            </>
          )}
        </Button>
        <Button onClick={onClear}>Clear</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
}
