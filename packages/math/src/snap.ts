/**
 * Result of angle snapping. When illegal is true, the angle is unsnapped
 * and an overlay should warn the user.
 */
export type SnapAngleResult = {
  angle: number;
  illegal?: boolean;
};

const SHIFT_SNAP_ANGLES = [0, 45, 90, 135, 180];
const ALT_SNAP_STEP = 15;

/**
 * Snaps a raw angle in degrees based on modifier keys held during line drawing.
 * - shift only: snaps to nearest of {0, 45, 90, 135, 180}
 * - alt only: snaps to nearest multiple of 15
 * - shift+alt: illegal combo — returns raw angle with illegal flag
 */
export function snapAngle(
  rawAngle: number,
  modifiers: { shift: boolean; alt: boolean },
): SnapAngleResult {
  const { shift, alt } = modifiers;

  if (shift && alt) {
    return { angle: rawAngle, illegal: true };
  }

  if (shift) {
    const best = SHIFT_SNAP_ANGLES.reduce((prev, curr) =>
      Math.abs(curr - rawAngle) < Math.abs(prev - rawAngle) ? curr : prev,
    );
    return { angle: best };
  }

  if (alt) {
    const snapped = Math.round(rawAngle / ALT_SNAP_STEP) * ALT_SNAP_STEP;
    return { angle: snapped % 360 };
  }

  return { angle: rawAngle };
}
