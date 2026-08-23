export type DragAction =
  | { kind: "drag"; dx: number; dy: number }
  | { kind: "duplicate-drag"; dx: number; dy: number };

/**
 * Resolves the drag action descriptor from pointer event modifiers.
 * When altKey is held at drag start, creates a duplicate of the dragged element.
 */
export function resolveDragAction(event: {
  altKey: boolean;
  dx: number;
  dy: number;
}): DragAction {
  if (event.altKey) {
    return { kind: "duplicate-drag", dx: event.dx, dy: event.dy };
  }
  return { kind: "drag", dx: event.dx, dy: event.dy };
}
