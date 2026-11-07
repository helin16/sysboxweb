import "@testing-library/jest-dom";

// jsdom has no PointerEvent; MouseEvent carries clientX and button, which the
// review carousel reads, so extend it with a pointerId.
if (typeof window !== "undefined" && !("PointerEvent" in window)) {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
    }
  }
  // @ts-ignore - assigning a minimal polyfill
  window.PointerEvent = PointerEventPolyfill;
}

if (typeof window !== "undefined") {
  if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = () => {};
  }

  // Default: no reduced-motion preference. Tests can override per case.
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
}
