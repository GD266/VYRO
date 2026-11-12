import { angleDegrees, distance, mean, midpoint, ratio, symmetryDeviation } from '@/analysis';

describe('geometry', () => {
  it('computes euclidean distance', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it('computes a midpoint', () => {
    expect(midpoint({ x: 2, y: 4 }, { x: 6, y: 8 })).toEqual({ x: 4, y: 6 });
  });

  it('computes the angle at a vertex in degrees', () => {
    const angle = angleDegrees({ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 });

    expect(angle).not.toBeNull();
    expect(angle).toBeCloseTo(90);
  });

  it('returns null for a zero-length vector', () => {
    expect(angleDegrees({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 })).toBeNull();
  });

  it('returns null when a ratio denominator is zero', () => {
    expect(ratio(1, 0)).toBeNull();
    expect(ratio(Number.NaN, 1)).toBeNull();
  });

  it('reports zero deviation for a symmetric pair', () => {
    expect(
      symmetryDeviation({ x: 0.3, y: 0.5 }, { x: 0.7, y: 0.5 }, 0.5),
    ).toBeCloseTo(0);
  });

  it('reports positive deviation for an asymmetric pair', () => {
    expect(
      symmetryDeviation({ x: 0.2, y: 0.5 }, { x: 0.75, y: 0.5 }, 0.5),
    ).toBeGreaterThan(0);
  });

  it('returns null for the mean of an empty list', () => {
    expect(mean([])).toBeNull();
    expect(mean([2, 4, 6])).toBe(4);
  });
});
