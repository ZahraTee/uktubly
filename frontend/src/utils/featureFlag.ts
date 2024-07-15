export function hasFeature(flag: keyof ImportMetaEnv): boolean {
  return import.meta.env[flag] === "true";
}
