import { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "tldraw/tldraw.css";
import "./App.css";

type Tool = "draw" | "eraser";

function App() {
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

  function toggleSelectedTool(forceDraw?: true) {
    let newTool: Tool = "draw";

    if (selectedTool === "draw" && !forceDraw) {
      newTool = "eraser";
    }

    setSelectedTool(newTool);
    editor?.setCurrentTool(newTool);
  }

  function clearCanvas() {
    const shapeIds = editor?.getCurrentPageShapeIds();
    if (shapeIds) {
      editor?.deleteShapes(Array.from(shapeIds));
      toggleSelectedTool(true);
    }
  }

  return (
    <>
      <h1>✏️ Uktubly</h1>
      <div className="drawing-area">
        <Tldraw
          hideUi
          onMount={(editor) => {
            setEditor(editor);
            editor.setCurrentTool(selectedTool);
          }}
        />
      </div>

      <div className="toolbar">
        <button onClick={() => toggleSelectedTool()}>
          {selectedTool === "draw" ? "Erase" : "Draw"}
        </button>
        <button onClick={clearCanvas}>Clear</button>
        <button>Submit</button>
      </div>
    </>
  );
}

export default App;
