import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';

const MIN_SCROLL_DELTA = 8;
const HIDE_AFTER_OFFSET = 72;

export function resolveStickyHeaderVisibility(
  lastScrollY: number,
  scrollY: number,
  currentlyVisible: boolean,
): { visible: boolean; lastScrollY: number } {
  if (scrollY <= 0) {
    return { visible: true, lastScrollY: scrollY };
  }

  const delta = scrollY - lastScrollY;

  if (delta > MIN_SCROLL_DELTA && scrollY > HIDE_AFTER_OFFSET) {
    return { visible: false, lastScrollY: scrollY };
  }

  if (delta < -MIN_SCROLL_DELTA) {
    return { visible: true, lastScrollY: scrollY };
  }

  return { visible: currentlyVisible, lastScrollY: scrollY };
}

@Injectable()
export class StickyHeaderController {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly visible = signal(true);

  private lastScrollY = 0;
  private ticking = false;

  attach(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const onScroll = () => {
      if (this.ticking) {
        return;
      }
      this.ticking = true;
      requestAnimationFrame(() => {
        this.updateVisibility(window.scrollY);
        this.ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() =>
      window.removeEventListener('scroll', onScroll),
    );
  }

  private updateVisibility(scrollY: number): void {
    const next = resolveStickyHeaderVisibility(
      this.lastScrollY,
      scrollY,
      this.visible(),
    );
    this.visible.set(next.visible);
    this.lastScrollY = next.lastScrollY;
  }
}
