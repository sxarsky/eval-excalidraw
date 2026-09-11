export type ColorMode = "auto" | "light" | "dark";

export const COLOR_MODE_STORAGE_KEY = "excalidraw-color-mode";

/**
 * Resolves the effective light/dark palette for an element.
 * "auto" defers to the global app theme; "light"/"dark" forces that
 * palette regardless of the global setting.
 */
export function resolveColorMode(
  elementColorMode: ColorMode | undefined,
  globalTheme: "light" | "dark",
): "light" | "dark" {
  if (!elementColorMode || elementColorMode === "auto") {
    return globalTheme;
  }
  return elementColorMode;
}
