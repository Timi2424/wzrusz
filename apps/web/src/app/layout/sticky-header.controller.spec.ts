import { resolveStickyHeaderVisibility } from './sticky-header.controller';

describe('resolveStickyHeaderVisibility', () => {
  it('keeps header visible at top of page', () => {
    expect(resolveStickyHeaderVisibility(40, 0, false)).toEqual({
      visible: true,
      lastScrollY: 0,
    });
  });

  it('hides after scrolling down past threshold', () => {
    expect(resolveStickyHeaderVisibility(0, 120, true)).toEqual({
      visible: false,
      lastScrollY: 120,
    });
  });

  it('shows again when scrolling up', () => {
    expect(resolveStickyHeaderVisibility(120, 90, false)).toEqual({
      visible: true,
      lastScrollY: 90,
    });
  });
});
