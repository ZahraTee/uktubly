import { useEffect, useState } from "react";

import Confetti from "react-confetti";
import { useWindowSize } from "usehooks-ts";

import { DrawingArea } from "../components/DrawingArea";
import { LetterBoard } from "../components/LetterBoard";
import { ARABIC_CHARACTERS_COUNT } from "../utils/consts";

export function FreeDrawView() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [alreadySeen, setAlreadySeen] = useState<boolean>(false);
  const [seenLetters, setSeenLetters] = useState<boolean[]>(
    new Array(ARABIC_CHARACTERS_COUNT).fill(false)
  );

  const areAllLettersSeen = seenLetters.every((seen) => seen);

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!areAllLettersSeen) {
      return;
    }

    setTimeout(() => {
      setIsComplete(true);
    }, 1000);
  }, [areAllLettersSeen]);

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

  const onRestart = () => {
    setSeenLetters(new Array(ARABIC_CHARACTERS_COUNT).fill(false));
    setIsComplete(false);
  };

  return (
    <main>
      {isComplete ? (
        <CompletedView onClickRestart={onRestart} />
      ) : (
        <>
          <p>Write an Arabic letter on the canvas below</p>
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
        </>
      )}
    </main>
  );
}

function CompletedView({ onClickRestart }: { onClickRestart: () => void }) {
  const { width, height } = useWindowSize();

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={1000}
        recycle={false}
      />
      <div className="complete">
        <span>🎉</span>
        <h2>You did it!</h2>
        <p>Look at you, acing the abjad. Want to give it another go?</p>
        <button onClick={onClickRestart}>Play again</button>
      </div>
    </>
  );
}
