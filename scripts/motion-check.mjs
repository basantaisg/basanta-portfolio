import assert from 'node:assert/strict';
import { setupMotion } from '../src/lib/motion.mjs';

// Test the lifecycle contract with an isolated DOM substitute; browser QA is separate.
class Element extends EventTarget {
  constructor() {
    super();
    this.classes = new Set();
    this.classList = { add: name => this.classes.add(name), remove: name => this.classes.delete(name) };
    this.style = {setProperty() {},removeProperty() {}};
  }
  contains(value) { return value === this; }
}
const preference = new EventTarget();
preference.matches = true;
let observers = [];
class Observer {
  constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
  observe() {}
  unobserve() {}
  disconnect() { this.disconnected = true; }
}
globalThis.window = {matchMedia:()=>preference,IntersectionObserver:Observer};
globalThis.IntersectionObserver = Observer;
globalThis.document = {activeElement:null};
const section = new Element();
const sample = new Element();
const details = new Element();
details.open = false;
details.querySelector = () => sample;
const root = new Element();
root.querySelectorAll = selector => selector === 'details' ? [details] : [section];
const isMoving = element => element.classes.has('motion-reveal');
const intersect = element => observers.at(-1).callback([{target:element,isIntersecting:true,boundingClientRect:{bottom:300}}]);

const cleanup = setupMotion(root);
assert.equal(observers.length,0,'Reduced-motion startup must not register reveals');
assert(!isMoving(section),'Reduced-motion content must stay still');
preference.matches = false;
preference.dispatchEvent(new Event('change'));
intersect(section);
assert(isMoving(section),'First viewport entrance should reveal the section');
const focus = new Event('focusin');
Object.defineProperty(focus,'target',{value:section});
root.dispatchEvent(focus);
assert(!isMoving(section),'Keyboard focus must immediately cancel motion');
intersect(section);
assert(!isMoving(section),'Repeated viewport entrance must not replay');

details.open = true;
details.dispatchEvent(new Event('toggle'));
assert(isMoving(sample),'First sample opening should reveal its copy');
details.open = false;
details.dispatchEvent(new Event('toggle'));
assert(!isMoving(sample),'Closing sample must remove active motion');
details.open = true;
details.dispatchEvent(new Event('toggle'));
assert(!isMoving(sample),'Reopening sample must not replay');

const extra = new Element();
intersect(extra);
assert(isMoving(extra));
preference.matches = true;
preference.dispatchEvent(new Event('change'));
assert(!isMoving(extra),'Live reduced-motion changes must cancel entrances');
assert(observers.at(-1).disconnected,'Reduced motion must disconnect observation');
cleanup();
const observerCount = observers.length;
preference.matches = false;
preference.dispatchEvent(new Event('change'));
assert.equal(observers.length,observerCount,'Unmount must remove media listener');
const secondCleanup = setupMotion(root);
intersect(section);
assert(!isMoving(section),'Effect reinitialization must not replay seen content');
secondCleanup();
delete window.IntersectionObserver;
assert.doesNotThrow(() => setupMotion(root)(), 'Unsupported browsers must retain static content');
console.log('PASS: simulated-DOM motion lifecycle — one-time reveals/openings, reduced motion, focus cancellation, cleanup, and static fallback. Browser testing is separate.');
