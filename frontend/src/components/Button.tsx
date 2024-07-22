import { usePlaySound } from "../utils/sounds";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * General sound settings are controlled via context but this is
   * for use when using buttons to control sound settings so they
   * can take effect immediately.
   * */
  enableSound?: boolean;
}

export function Button({ enableSound, ...buttonProps }: ButtonProps) {
  const playClickSound = usePlaySound("BUTTON_CLICK");

  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    playClickSound({ forceSoundEnabled: enableSound });
    buttonProps.onClick?.(e);
  };

  return <button {...buttonProps} onClick={onClick} />;
}
