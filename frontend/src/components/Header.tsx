import { NavLink } from "react-router-dom";

import { Logo } from "./Logo";
import { Button } from "./Button";
import { useSettings } from "../utils/SettingsContextProvider";
import SoundOff from "./icons/SoundOff";
import SoundOn from "./icons/SoundOn";

export function Header() {
  const { isSoundEnabled, toggleSound } = useSettings();

  return (
    <header>
      <NavLink
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? "active" : ""
        }
        to="/"
      >
        <Logo />
      </NavLink>
      <div className="options">
        <Button
          onClick={() => toggleSound(!isSoundEnabled)}
          forceSoundEnabled={!isSoundEnabled}
        >
          {isSoundEnabled ? <SoundOff /> : <SoundOn />}
          <span className="sr-only">
            {isSoundEnabled ? "Mute" : "Unmute"} sound
          </span>
        </Button>
      </div>
    </header>
  );
}
