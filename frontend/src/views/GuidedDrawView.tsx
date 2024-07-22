import { useEffect, useState } from "react";

import { Button } from "../components/Button";
import { DrawingArea } from "../components/DrawingArea";
import { LetterBoard } from "../components/LetterBoard";
import { ARABIC_CHARACTERS_EN, ARABIC_CHARACTERS_COUNT } from "../utils/consts";
import { useSuccessSound } from "../utils/sounds";

export function GuidedDrawView() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  const [seenLetters, setSeenLetters] = useState<boolean[]>(
    new Array(ARABIC_CHARACTERS_COUNT).fill(false)
  );

  const isComplete = seenLetters.every((seen) => seen);

  const onRestart = () => {
    setSeenLetters(new Array(ARABIC_CHARACTERS_COUNT).fill(false));
    setCurrentLetterIndex(0);
  };

  const onNextLetter = () => {
    setSeenLetters((prev) => {
      const newSeenLetters = [...prev];
      newSeenLetters.splice(currentLetterIndex, 1, true);
      return newSeenLetters;
    });
    setCurrentLetterIndex((c) => c + 1);
  };

  return (
    <main>
      {isComplete ? (
        <CompletedView onRestart={onRestart} />
      ) : (
        <DrawingView
          currentLetterIndex={currentLetterIndex}
          onNextLetter={onNextLetter}
          seenLetters={seenLetters}
        />
      )}
    </main>
  );
}

function DrawingView({
  currentLetterIndex,
  onNextLetter,
  seenLetters,
}: {
  currentLetterIndex: number;
  onNextLetter: () => void;
  seenLetters: boolean[];
}) {
  const playSuccessSound = useSuccessSound();

  const [hasPredictionError, setHasPredictionError] = useState(false);

  const onSubmit = async (predictedIndex: number) => {
    if (predictedIndex !== currentLetterIndex) {
      setHasPredictionError(true);
    } else {
      playSuccessSound();
      onNextLetter();
    }
  };
  const onClearCanvas = () => {
    setHasPredictionError(false);
  };

  const transliteratedLetter = ARABIC_CHARACTERS_EN[currentLetterIndex];
  const indefiniteArticle =
    transliteratedLetter.startsWith("a") || transliteratedLetter.startsWith("^")
      ? "an"
      : "a";

  return (
    <>
      <p>
        Write me {indefiniteArticle} {ARABIC_CHARACTERS_EN[currentLetterIndex]}
      </p>
      <div className="action-area">
        <DrawingArea onSubmit={onSubmit} onClear={onClearCanvas} />

        <div className="results-area">
          <LetterBoard seenStatus={seenLetters} />
          <p className={hasPredictionError ? "error" : "hidden-error"}>
            {hasPredictionError
              ? "Oops, not quite. Try again?"
              : "Already got that one!"}
          </p>
        </div>
      </div>
    </>
  );
}

function CompletedView({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="complete info">
      <h2>Complete!</h2>
      <p>Want to go again?</p>
      <Button onClick={onRestart}>Start again</Button>
    </div>
  );
}