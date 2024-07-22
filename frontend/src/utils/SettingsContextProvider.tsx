import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface Settings {
  isSoundEnabled: boolean;
}

interface SettingsContext extends Settings {
  toggleSound: (newValue: boolean) => void;
}

const DEFAULT_SETTINGS: Settings = { isSoundEnabled: true };

const DEFAULT_CONTEXT_VALUE: SettingsContext = {
  ...DEFAULT_SETTINGS,
  toggleSound: () => {},
};

export const SettingsContext = React.createContext(DEFAULT_CONTEXT_VALUE);

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const toggleSound = useCallback(() => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      isSoundEnabled: !currentSettings.isSoundEnabled,
    }));
  }, []);

  const value: SettingsContext = useMemo(
    () => ({ ...settings, toggleSound }),
    [settings, toggleSound]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
