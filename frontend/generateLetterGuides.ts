import satori, { SatoriOptions } from "satori";
import fs from "fs/promises";
import { ReactNode } from "react";

const LETTERS = [
  "ا",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ﻫ",
  "و",
  "ي",
];

/**
 * This script generates a JSON array of SVG strings that depict Arabic letters.
 * An SVG string is placed onto the canvas in "Guided Draw" when the "Show
 * letter guide" option is enabled.
 *
 * The stroke is quite thin so the model will not recognise most of these as they
 * are, but it should when they are traced over with a thicker stroke.
 */
async function generateLetterGuides() {
  const fontData = await fs.readFile("./IBMPlexSansArabic.ttf");

  const opts: SatoriOptions = {
    width: 200,
    height: 200,
    fonts: [
      {
        name: "IBM Plex Sans Arabic",
        data: fontData,
        weight: 300,
        style: "normal",
      },
    ],
  };

  const letterNodes = LETTERS.map((letter) => {
    return {
      type: "div",
      props: {
        style: {
          color: "#000",
          display: "flex",
          justifyContent: "center",
          fontSize: 160,
          width: "200px",
          height: "200px",
          opacity: "0.3",
        },
        children: [
          {
            type: "div",
            props: {
              children: letter,
              style: {
                transform: "translateY(-50px)",
              },
            },
          },
        ],
      },
    } as ReactNode;
  });

  const promises = letterNodes.map((node) => satori(node, opts));
  const promiseResults = await Promise.allSettled(promises);
  const letterSvgs: string[] = [];

  promiseResults.forEach((pr, i) => {
    if (pr.status === "rejected") {
      console.error(`"Failed to generate guides for ${LETTERS[i]}`);
      return;
    }
    letterSvgs.push(pr.value.toString());
  });

  fs.writeFile(`src/utils/guides.json`, JSON.stringify(letterSvgs));
}

generateLetterGuides();
