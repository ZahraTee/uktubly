import { hasFeature } from "./featureFlag";

export const ARABIC_CHARACTERS_AR: Record<number, string> = {
  0: "ا",
  1: "ب",
  2: "ت",
  3: "ث",
  4: "ج",
  5: "ح",
  6: "خ",
  7: "د",
  8: "ذ",
  9: "ر",
  10: "ز",
  11: "س",
  12: "ش",
  13: "ص",
  14: "ض",
  15: "ط",
  16: "ظ",
  17: "ع",
  18: "غ",
  19: "ف",
  20: "ق",
  21: "ك",
  22: "ل",
  23: "م",
  24: "ن",
  25: "ﻫ",
  26: "و",
  27: "ي",
};

export const ARABIC_CHARACTERS_EN: Record<number, string> = {
  0: "alif",
  1: "ba'",
  2: "ta'",
  3: "tha'",
  4: "jeem",
  5: "ḥa'",
  6: "kha'",
  7: "daal",
  8: "thaal",
  9: "ra'",
  10: "zay",
  11: "seen",
  12: "sheen",
  13: "ṣaad",
  14: "ḍaad",
  15: "ṭa'",
  16: "dha'",
  17: "^ayn",
  18: "ghayn",
  19: "fa'",
  20: "qaf",
  21: "kaf",
  22: "lam",
  23: "meem",
  24: "noon",
  25: "ha'",
  26: "waw",
  27: "ya'",
};

export const ARABIC_CHARACTERS_COUNT =
  Object.values(ARABIC_CHARACTERS_AR).length;

/** This is the width and height of the images the model is trained for */
export const INPUT_IMAGE_SIZE = 32;

export interface Mode {
  title: string;
  description: string;
  emoji: string;
  path: string;
}
export const MODES: Mode[] = [
  ...(hasFeature("VITE_SHOW_GUIDED_MODE")
    ? [
        {
          title: "Guided Draw",
          emoji: "🤝",
          description:
            "Still learning? Draw the letter you're asked for (with an extra helping hand if needed!)",
          path: "/guideddraw",
        },
      ]
    : []),
  {
    title: "Free Draw",
    emoji: "🤠",
    description:
      "Don't want to rush but don't need your hand held? Find the letters at your leisure!",
    path: "/freedraw",
  },
  {
    title: "Quick Draw",
    emoji: "⏱️",
    description: "Race against the clock to find all the letters!",
    path: "/quickdraw",
  },
];
