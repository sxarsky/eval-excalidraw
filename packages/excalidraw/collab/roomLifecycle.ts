export type RoomState = "active" | "archived" | "deleted";

export type RoomLifecycleResult =
  | { success: true; state: RoomState; timestamp: number }
  | { success: false; error: "INVALID_STATE" | "GONE" };

const RESTORE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Archive an active room. Returns INVALID_STATE if already archived.
 */
export function archiveRoom(
  currentState: RoomState,
  now: number = Date.now(),
): RoomLifecycleResult {
  if (currentState !== "active") {
    return { success: false, error: "INVALID_STATE" };
  }
  return { success: true, state: "archived", timestamp: now };
}

/**
 * Restore an archived or deleted room. Returns GONE if deletion window expired.
 */
export function restoreRoom(
  currentState: RoomState,
  deletedAt: number | null,
  now: number = Date.now(),
): RoomLifecycleResult {
  if (currentState === "deleted") {
    if (deletedAt === null) {
      return { success: false, error: "INVALID_STATE" };
    }
    if (now - deletedAt > RESTORE_WINDOW_MS) {
      return { success: false, error: "GONE" };
    }
  }
  if (currentState !== "archived" && currentState !== "deleted") {
    return { success: false, error: "INVALID_STATE" };
