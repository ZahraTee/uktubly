import { ARABIC_CHARACTERS_AR } from "../utils/consts";

const ARABIC_CHARS_ARR = Object.values(ARABIC_CHARACTERS_AR);

export function LetterBoard({ seenStatus }: { seenStatus: boolean[] }) {
  return (
    <>
      <div className="board" dir="rtl">
        {seenStatus.map((seen, i) => (
          <div key={i} className={`tile ${seen ? "found" : "unfound"}`}>
            {seen ? ARABIC_CHARS_ARR[i] : "?"}
          </div>
        ))}
      </div>
    </>
  );
}
