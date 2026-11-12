export interface Point2D {
  readonly x: number;
  readonly y: number;
}

const EPSILON = 1e-9;

export function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function midpoint(a: Point2D, b: Point2D): Point2D {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

/**
 * Returns the angle at `vertex` in degrees, or null when either vector has
 * zero length. The result is in the range 0..180.
 */
export function angleDegrees(a: Point2D, vertex: Point2D, b: Point2D): number | null {
  const vectorA = { x: a.x - vertex.x, y: a.y - vertex.y };
  const vectorB = { x: b.x - vertex.x, y: b.y - vertex.y };
  const lengthA = Math.hypot(vectorA.x, vectorA.y);
  const lengthB = Math.hypot(vectorB.x, vectorB.y);

  if (lengthA < EPSILON || lengthB < EPSILON) {
    return null;
  }

  const dot = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  const cosine = Math.min(Math.max(dot / (lengthA * lengthB), -1), 1);
  return (Math.acos(cosine) * 180) / Math.PI;
}

/**
 * Returns numerator / denominator, or null for a zero/invalid denominator.
 * Ratios are the preferred representation because they are independent of
 * image scale.
 */
export function ratio(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    return null;
  }
  if (Math.abs(denominator) < EPSILON) {
    return null;
  }
  return numerator / denominator;
}

/**
 * Returns 0..1, where 0 means the pair is equidistant from the vertical axis.
 * This is a geometric deviation, not an attractiveness or "symmetry score".
 */
export function symmetryDeviation(left: Point2D, right: Point2D, axisX: number): number {
  const leftDistance = Math.abs(left.x - axisX);
  const rightDistance = Math.abs(right.x - axisX);
  const largest = Math.max(leftDistance, rightDistance);

  if (largest < EPSILON) {
    return 0;
  }

  return Math.abs(leftDistance - rightDistance) / largest;
}

export function mean(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function percentDifference(value: number, reference: number): number | null {
  if (reference === 0 || !Number.isFinite(value) || !Number.isFinite(reference)) {
    return null;
  }
  return ((value - reference) / reference) * 100;
}
