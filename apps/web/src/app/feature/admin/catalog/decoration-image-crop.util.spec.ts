import {
  computeBaseScale,
  computeCropRect,
  DECORATION_CROP_ASPECT,
} from './decoration-image-crop.util';

describe('decoration-image-crop.util', () => {
  it('uses cover scale for the crop frame', () => {
    expect(computeBaseScale(2000, 1000, { width: 400, height: 300 })).toBe(0.3);
  });

  it('maps frame to source crop with pan and zoom', () => {
    const frame = { width: 400, height: 300 };
    const baseScale = computeBaseScale(800, 600, frame);
    const crop = computeCropRect(800, 600, frame, {
      baseScale,
      zoom: 1,
      panX: 0,
      panY: 0,
    });

    expect(crop.width / crop.height).toBeCloseTo(DECORATION_CROP_ASPECT, 5);
    expect(crop.x).toBeGreaterThanOrEqual(0);
    expect(crop.y).toBeGreaterThanOrEqual(0);
  });
});
