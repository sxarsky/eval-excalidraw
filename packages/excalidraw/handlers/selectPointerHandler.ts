import type { AppState } from "../types";

export type SelectPointerAction =
  | { kind: "element-hit"; elementId: string }
  | { kind: "empty-canvas" }
  | { kind: "resize-handle"; handleIndex: number };

/**
 * Routes select-tool pointer events to typed action descriptors.
 * appState provides tool-lock and editing context for routing decisions.
 */
export function handleSelectPointerEvent(event: {
  type: "pointerdown" | "pointermove" | "pointerup";
  target: "element" | "canvas" | "handle";
  elementId?: string;
  handleIndex?: number;
  appState?: Pick<AppState, "activeTool" | "editingGroupId">;
}): SelectPointerAction {
  if (event.target === "element" && event.elementId) {
    return { kind: "element-hit", elementId: event.elementId };
  }
  if (event.target === "handle" && event.handleIndex !== undefined) {
    return { kind: "resize-handle", handleIndex: event.handleIndex };
  }
  return { kind: "empty-canvas" };
}
