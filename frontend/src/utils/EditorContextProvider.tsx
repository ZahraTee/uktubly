import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Editor } from "tldraw";

interface EditorContext {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  clear: () => void;
}

const BLANK_CONTEXT_VALUE: EditorContext = {
  editor: null,
  setEditor: () => {},
  clear: () => {},
};

export const EditorContext = React.createContext(BLANK_CONTEXT_VALUE);

export function EditorContextProvider({ children }: { children: ReactNode }) {
  const [editor, setEditor] = useState<Editor | null>(null);

  const clear = useCallback(() => {
    const currentShapeIds = editor?.getCurrentPageShapeIds();
    const hasDrawing = currentShapeIds?.size ?? 0 > 0;
    if (currentShapeIds && hasDrawing) {
      editor?.deleteShapes(Array.from(currentShapeIds));
    }
  }, [editor]);

  const value: EditorContext = useMemo(
    () => ({ editor, setEditor, clear }),
    [editor, setEditor, clear]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
