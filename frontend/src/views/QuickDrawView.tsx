import { useCallback, useEffect, useState } from "react";
import { DrawingArea } from "../components/DrawingArea";
import { LetterBoard } from "../components/LetterBoard";
import { ARABIC_CHARACTERS_COUNT } from "../utils/consts";
import { useInterval, useLocalStorage } from "usehooks-ts";

const PERSONAL_BEST_KEY = "uktubly:quickdraw:personalbest";

export function QuickDrawView() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [showCompletionStep, setShowCompletionStep] = useState(false);

  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
  const [personalBestStr, setPersonalBestStr] = useLocalStorage(
    PERSONAL_BEST_KEY,
    ""
  );

  const personalBest: number | null =
    personalBestStr !== "" ? parseInt(personalBestStr, 10) : null;

  console.log("pb", personalBestStr, personalBest);

  const onStart = useCallback(() => {
    setStartTime(Date.now());
  }, []);

  const onFinish = useCallback(() => {
    const currentFinishTime = Date.now();
    setFinishTime(currentFinishTime);

    const timeElapsed = currentFinishTime - (startTime ?? 0);

    if (timeElapsed <= (personalBest ?? timeElapsed)) {
      setPersonalBestStr(timeElapsed.toString());
      setIsNewPersonalBest(true);
    }

    setTimeout(() => {
      setShowCompletionStep(true);
    }, 1000);
  }, [personalBest, setPersonalBestStr, startTime]);

  const onRestart = useCallback(() => {
    setFinishTime(null);
    setStartTime(Date.now());
    setIsNewPersonalBest(false);
  }, []);

  return (
    <main>
      {startTime === null && <InitialStep onStart={onStart} />}
      {startTime !== null && !showCompletionStep && (
        <GameStep startTime={startTime} onFinish={onFinish} />
      )}
      {showCompletionStep && startTime && finishTime && (
        <CompletionStep
          startTime={startTime}
          finishTime={finishTime}
          onRestart={onRestart}
          personalBest={personalBest}
          isNewPersonalBest={isNewPersonalBest}
        />
      )}
    </main>
  );
}

function InitialStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="info">
      <h2>Quick draw</h2>
      <p>Write the letters of the Arabic alphabet as fast as you can!</p>
      <p>It's you against the clock. ⏱️</p>
      <button onClick={onStart}>Yalla, let's do this!</button>
    </div>
  );
}

function GameStep({
  startTime,
  onFinish,
}: {
  startTime: number;
  onFinish: () => void;
}) {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [alreadySeen, setAlreadySeen] = useState<boolean>(false);
  const [seenLetters, setSeenLetters] = useState<boolean[]>(
    new Array(ARABIC_CHARACTERS_COUNT).fill(false)
  );
  const [timeElapsed, setTimeElapsed] = useState(0);

  useInterval(() => {
    setTimeElapsed(Date.now() - startTime);
  }, 10);

  const areAllLettersSeen = seenLetters.every((seen) => seen);

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

  useEffect(() => {
    if (!areAllLettersSeen) {
      return;
    }

    onFinish();
  }, [areAllLettersSeen, onFinish]);

  const hasPredictionError = prediction === -1;

  const onClearCanvas = () => {
    setPrediction(null);
  };

  return (
    <>
      <p className="stopwatch">{(timeElapsed / 1000).toFixed(2)}</p>
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
  );
}

function CompletionStep({
  startTime,
  finishTime,
  personalBest,
  isNewPersonalBest,
  onRestart,
}: {
  startTime: number;
  finishTime: number;
  personalBest: number | null;
  isNewPersonalBest: boolean;
  onRestart: () => void;
}) {
  const hasNavigatorSharing = typeof navigator.share === "function";
  const timeTakenSecs = ((finishTime - startTime) / 1000).toFixed(2);

  const shareData = {
    title: "Uktubly - The Arabic alphabet game augmented with AI!",
    text: `I got all the letters in ${timeTakenSecs} seconds! Can you beat my time?`,
    url: "https://uktubly.zahra.dev/quickdraw",
  };

  const pbSecs = personalBest
    ? (personalBest / 1000).toFixed(2)
    : timeTakenSecs;
  return (
    <div className="complete info">
      <h2>You did it!</h2>
      <p>
        You took {timeTakenSecs} seconds!{" "}
        {isNewPersonalBest
          ? "That's a new personal best!"
          : `Your personal best is ${pbSecs}s.`}
      </p>
      <p>Want to see if you can beat your time?</p>
      {hasNavigatorSharing ? (
        <button onClick={() => navigator.share(shareData)}>
          Share your time
        </button>
      ) : null}
      <button onClick={onRestart}>Aywaaa, let's go!</button>
    </div>
  );
}
