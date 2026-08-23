export type LibraryItemVisibility = "private" | "team-shared" | "public";

export type VisibilityTransition = {
  from: LibraryItemVisibility;
  to: LibraryItemVisibility;
};

const ALLOWED_FORWARD_TRANSITIONS: Array<[LibraryItemVisibility, LibraryItemVisibility]> = [
  ["private", "team-shared"],
  ["team-shared", "public"],
];

const ALLOWED_REVERSE_TRANSITIONS: Array<[LibraryItemVisibility, LibraryItemVisibility]> = [
  ["public", "team-shared"],
  ["team-shared", "private"],
];

/**
 * Returns true if the visibility transition is valid.
 * Forward: private→team-shared→public (stepwise only; no skip).
 * Reverse: allowed in any step.
 */
export function isValidVisibilityTransition(
  from: LibraryItemVisibility,
  to: LibraryItemVisibility,
): boolean {
  if (from === to) {
    return false;
  }
  return (
    ALLOWED_FORWARD_TRANSITIONS.some(([f, t]) => f === from && t === to) ||
    ALLOWED_REVERSE_TRANSITIONS.some(([f, t]) => f === from && t === to)
  );
}
