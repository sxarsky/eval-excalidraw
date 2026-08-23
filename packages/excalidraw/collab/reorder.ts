export type ReorderPayload = {
  elementId: string;
  newIndex: number;
  priorVersion: number;
};

export type ReorderResult =
  | { success: true; newVersion: number }
  | { success: false; conflict: true; currentVersion: number }
  | { success: false; notFound: true };

/**
 * Applies a reorder operation with optimistic concurrency check.
 * Returns conflict if priorVersion doesn't match stored version.
 * Client should auto-retry once on conflict using the currentVersion.
 */
export function applyReorder(
  elementVersions: Map<string, number>,
  payload: ReorderPayload,
  elementOrders?: Map<string, number>,
): ReorderResult {
  if (!elementVersions.has(payload.elementId)) {
    return { success: false, notFound: true };
  }
  const currentVersion = elementVersions.get(payload.elementId)!;
  if (payload.priorVersion !== currentVersion) {
    return { success: false, conflict: true, currentVersion };
  }
  const newVersion = currentVersion + 1;
  elementVersions.set(payload.elementId, newVersion);
  if (elementOrders) {
    elementOrders.set(payload.elementId, payload.newIndex);
  }
  return { success: true, newVersion };
}
