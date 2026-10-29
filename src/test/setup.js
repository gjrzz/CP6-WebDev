import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

// As páginas lazy (login, dashboard) carregam do zero no 1º teste de cada arquivo; com a
// suíte inteira em paralelo, isso passa do 1 s padrão dos findBy/waitFor
configure({ asyncUtilTimeout: 5000 });

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
