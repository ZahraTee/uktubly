import useSound from "use-sound";

import buttonClickSound from "../sounds/button-click.mp3";
import successSound from "../sounds/success.mp3";
import success2Sound from "../sounds/success2.mp3";

import { useSettings } from "./SettingsContextProvider";
import { useState } from "react";

const sounds = {
  SUCCESS: successSound,
  SUCCESS_2: success2Sound,
  BUTTON_CLICK: buttonClickSound,
} as const;

type Sound = keyof typeof sounds;

export function usePlaySound(soundName: Sound) {
  const { isSoundEnabled: soundEnabled } = useSettings();
  const [play] = useSound(sounds[soundName], {
    soundEnabled,
  });

  return play;
}

export function useSuccessSound() {
  const [count, setCount] = useState(0);
  const soundName = count % 2 === 0 ? "SUCCESS" : "SUCCESS_2";

  const play = usePlaySound(soundName);

  return () => {
    play();
    setCount((c) => c + 1);
  };
}
