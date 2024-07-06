import { useState } from "react";
import "tldraw/tldraw.css";
import { LetterBoard } from "./components/LetterBoard";
import { ARABIC_CHARACTERS_COUNT } from "./consts";
import { DrawingArea } from "./components/DrawingArea";

function App() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [alreadySeen, setAlreadySeen] = useState<boolean>(false);
  const [seenLetters, setSeenLetters] = useState<boolean[]>(
    new Array(ARABIC_CHARACTERS_COUNT).fill(false)
  );

  const onSubmit = async (predictedIndex: number) => {
    const hasLetterBeenSeen = seenLetters[predictedIndex];

    setAlreadySeen(hasLetterBeenSeen);
    setPrediction(predictedIndex);

    if (hasLetterBeenSeen || predictedIndex === -1) {
      return;
    }

    setSeenLetters((prev) => {
      const newSeenLetters = [...prev];
      newSeenLetters.splice(predictedIndex, 1, true);
      return newSeenLetters;
    });
  };

  const hasPredictionError = prediction === -1;

  const onClearCanvas = () => {
    setPrediction(null);
  };

  return (
    <main>
      <h1>Uktubly</h1>
      <p>✏️ Write an Arabic letter...</p>
      <div className="action-area">
        <DrawingArea onSubmit={onSubmit} onClear={onClearCanvas} />

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
