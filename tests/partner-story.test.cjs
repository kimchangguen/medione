const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/partner-story.js'), 'utf8');

function setup(options = {}) {
  class Element {
    constructor() {
      this.children = [];
      this.attributes = {};
      this.listeners = {};
      this.classes = new Set();
      this.classList = {
        add: (name) => this.classes.add(name),
        remove: (name) => this.classes.delete(name),
        toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name)
      };
    }
    appendChild(child) { this.children.push(child); }
    setAttribute(key, value) { this.attributes[key] = value; }
    addEventListener(name, listener) { this.listeners[name] = listener; }
    focus() {}
  }
  const elements = Object.fromEntries(['partnerStoryPanel', 'partnerStoryNav', 'partnerStoryVisual',
    'partnerStoryArtwork', 'partnerStoryText', 'partnerStoryLabel', 'partnerStoryTitle'].map(id => [id, new Element()]));
  let observerCallback;
  let now = 0;
  let nextTimer = 0;
  const timers = new Map();
  const windowListeners = {};
  const document = {
    hidden: false, listeners: {},
    getElementById: id => elements[id],
    querySelector: () => elements.partnerStoryPanel,
    createElement: () => new Element(),
    addEventListener(name, listener) { this.listeners[name] = listener; }
  };
  class IntersectionObserver {
    constructor(callback) { observerCallback = callback; }
    observe() {}
  }
  const window = {
    IntersectionObserver,
    matchMedia: () => ({ matches: Boolean(options.reducedMotion) }),
    setInterval(fn, ms) { const id = ++nextTimer; timers.set(id, { fn, ms, due: now + ms }); return id; },
    clearInterval(id) { timers.delete(id); },
    addEventListener(name, fn) { windowListeners[name] = fn; }
  };
  vm.runInNewContext(source, { document, window, IntersectionObserver });
  document.listeners.DOMContentLoaded();
  const advance = ms => {
    const end = now + ms;
    while (true) {
      const next = [...timers.values()].sort((a, b) => a.due - b.due)[0];
      if (!next || next.due > end) break;
      now = next.due;
      next.due += next.ms;
      next.fn();
    }
    now = end;
  };
  return {
    advance, timers, elements, windowListeners,
    visible(ratio = 1) { observerCallback([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]); },
    hidden(value) { document.hidden = value; document.listeners.visibilitychange(); },
    click(index) { elements.partnerStoryNav.children[index].listeners.click(); },
    current() { return elements.partnerStoryLabel.textContent; },
    selected() { return elements.partnerStoryNav.children.map(b => b.attributes['aria-selected']); }
  };
}

test('visible carousel advances 01 → 02 → 03 → 04 → 01 every 2000ms without scroll input', () => {
  const app = setup();
  app.advance(10000);
  assert.equal(app.current(), 'PARTNER SUPPORT 01');
  assert.equal(app.timers.size, 0);
  app.visible();
  for (const step of ['02', '03', '04', '01']) {
    const previous = app.current();
    app.advance(1999);
    assert.equal(app.current(), previous);
    app.advance(1);
    assert.equal(app.current(), 'PARTNER SUPPORT ' + step);
    assert.equal(app.selected().filter(s => s === 'true').length, 1);
    assert.equal(app.selected()[Number(step) - 1], 'true');
  }
  assert.deepEqual(Object.keys(app.windowListeners), []);
});

test('manual selection is immediate and resets the full 2000ms interval, including repeated clicks', () => {
  const app = setup();
  app.visible();
  app.advance(1500);
  app.click(2);
  assert.equal(app.current(), 'PARTNER SUPPORT 03');
  app.advance(1999);
  assert.equal(app.current(), 'PARTNER SUPPORT 03');
  app.advance(1);
  assert.equal(app.current(), 'PARTNER SUPPORT 04');
  app.advance(2000);
  assert.equal(app.current(), 'PARTNER SUPPORT 01');
  app.advance(1900);
  app.click(0);
  app.advance(1999);
  assert.equal(app.current(), 'PARTNER SUPPORT 01');
  app.advance(1);
  assert.equal(app.current(), 'PARTNER SUPPORT 02');
});

test('viewport exit stops playback; reentry resumes without choosing a new step or duplicating timers', () => {
  const app = setup();
  app.visible();
  app.advance(2000);
  app.visible(0.1);
  app.advance(10000);
  assert.equal(app.current(), 'PARTNER SUPPORT 02');
  assert.equal(app.timers.size, 0);
  app.visible();
  app.visible(0.8);
  assert.equal(app.timers.size, 1);
  assert.equal(app.current(), 'PARTNER SUPPORT 02');
  app.advance(2000);
  assert.equal(app.current(), 'PARTNER SUPPORT 03');
});

test('hidden browser tab pauses and resumes with a fresh interval', () => {
  const app = setup();
  app.visible();
  app.hidden(true);
  app.advance(10000);
  assert.equal(app.current(), 'PARTNER SUPPORT 01');
  app.hidden(false);
  app.advance(2000);
  assert.equal(app.current(), 'PARTNER SUPPORT 02');
});

test('reduced motion preserves autoplay while suppressing entrance animation', () => {
  const app = setup({ reducedMotion: true });
  app.visible();
  app.advance(2000);
  assert.equal(app.current(), 'PARTNER SUPPORT 02');
  assert.equal(app.elements.partnerStoryVisual.classes.has('is-entering'), false);
});

test('only selected copy is exposed, while all copy panels reserve intrinsic layout height', () => {
  const app = setup();
  const panels = app.elements.partnerStoryText.children;
  assert.equal(panels.length, 4);
  panels.forEach(panel => assert.equal(panel.children[0].children.length, 3));
  app.click(3);
  assert.deepEqual(panels.map(p => p.attributes['aria-hidden']), ['true', 'true', 'true', 'false']);
});
