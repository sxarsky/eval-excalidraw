import { distance2d, pointFrom, pointRotateRads } from "../src/point";

import type { Radians } from "../src/types";

describe("rotate", () => {
  it("should rotate over (x2, y2) and return the rotated coordinates for (x1, y1)", () => {
    const x1 = 10;
    const y1 = 20;
    const x2 = 20;
    const y2 = 30;
    const angle = (Math.PI / 2) as Radians;
    const [rotatedX, rotatedY] = pointRotateRads(
      pointFrom(x1, y1),
      pointFrom(x2, y2),
      angle,
    );
    expect([rotatedX, rotatedY]).toEqual([30, 20]);
    const res2 = pointRotateRads(
      pointFrom(rotatedX, rotatedY),
      pointFrom(x2, y2),
      -angle as Radians,
    );
    expect(res2).toEqual([x1, x2]);
  });
});

describe("distance2d", () => {
  it("computes distance between two tuple-form points", () => {
    expect(distance2d([0, 0], [3, 4])).toBe(5);
  });

  it("computes distance between two object-form points", () => {
    expect(distance2d({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("computes distance with mixed tuple and object forms", () => {
    expect(distance2d([0, 0], { x: 3, y: 4 })).toBe(5);
  });

  it("returns 0 for the same point", () => {
    expect(distance2d([0, 0], [0, 0])).toBe(0);
  });
});
