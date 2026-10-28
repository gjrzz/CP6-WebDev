import '@testing-library/jest-dom/vitest';

// jsdom não implementa estas APIs, que o Motion usa (whileInView e reduced motion).
// Os testes que precisam de outro comportamento sobrescrevem com vi.stubGlobal.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver ??= IntersectionObserverStub;

window.matchMedia ??= (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
});
