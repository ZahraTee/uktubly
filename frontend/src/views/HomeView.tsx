import { NavLink } from "react-router-dom";
import { Logo } from "../components/Logo";
import { MODES, type Mode } from "../utils/consts";

export function HomeView() {
  return (
    <main className="flex">
      <div className="intro">
        <Logo />
        <p>Augment your Arabic alphabet acquisition with AI</p>
      </div>
      <div className="modes">
        {MODES.map((mode) => (
          <ModeButton mode={mode} key={mode.title} />
        ))}
      </div>
    </main>
  );
}

export function ModeButton({
  mode: { title, description, emoji, path },
}: {
  mode: Mode;
}) {
  return (
    <NavLink to={path} className="mode">
      <div className="emoji">{emoji}</div>
      <div className="text">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </NavLink>
  );
}
