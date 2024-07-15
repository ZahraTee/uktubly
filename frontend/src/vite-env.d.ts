/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SHOW_OPTIONS: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
