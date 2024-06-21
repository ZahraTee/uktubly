import { useState } from "react";
import { Tldraw, type Editor } from "tldraw";

import "tldraw/tldraw.css";
import "./App.css";

type Tool = "draw" | "eraser";

function App() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("draw");

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
