// CSS owns the animation; JavaScript only starts it once when content is visible.
// The resting document is fully visible, including when JavaScript fails.
const seen = new WeakSet();

export function setupMotion(root) {
  if (!root || typeof window === 'undefined' || !window.matchMedia || !('IntersectionObserver' in window)) return () => {};

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  const disposers = [];
  let observer;
  let stopped = false;

  function finish(element) {
    element.classList.remove('motion-reveal');
    element.style.removeProperty('--reveal-delay');
    active.delete(element);
  }

  // Stagger within a group: 60ms steps, capped at 80ms to avoid making visitors wait.
  const STAGGER_STEP = 60;
  const STAGGER_MAX  = 80;

  function reveal(element, delay = 0) {
    if (!element || stopped || seen.has(element)) return;
    seen.add(element);
    // Keyboard users and reduced-motion users always get the immediate resting state.
    if (preference.matches || element.contains(document.activeElement)) return;
    active.add(element);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    element.classList.add('motion-reveal');
  }

  function observe() {
    if (stopped || preference.matches) return;
    const nextObserver = new IntersectionObserver(entries => {
      if (stopped || preference.matches || observer !== nextObserver) return;
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      for (const [index, { target, isIntersecting, boundingClientRect }] of visible.entries()) {
        if (!isIntersecting || seen.has(target)) continue;
        nextObserver.unobserve(target);
        // Elements already scrolled past (bottom <= 0) get marked seen without animation.
        if (boundingClientRect.bottom <= 0) { seen.add(target); continue; }
        reveal(target, Math.min(index * STAGGER_STEP, STAGGER_MAX));
      }
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
    observer = nextObserver;
    // Observe hero secondary elements and all [data-reveal] blocks.
    // Never wraps or splits existing text — only applies to designated containers.
    root.querySelectorAll('.hero-copy, .hero-visual, [data-reveal]').forEach(element => {
      if (!seen.has(element)) nextObserver.observe(element);
    });
  }

  function stop() {
    observer?.disconnect();
    observer = undefined;
    for (const element of [...active]) finish(element);
  }

  const onPreference = () => { stop(); observe(); };
  // Track both keyframe names (default reveal and the hero-visual lateral variant).
  const REVEAL_NAMES = new Set(['portfolio-reveal', 'portfolio-reveal-visual']);
  const onAnimationEnd = event => {
    if (REVEAL_NAMES.has(event.animationName)) finish(event.target);
  };
  const onFocus = event => {
    for (const element of [...active]) {
      if (element.contains(event.target)) finish(element);
    }
  };

  preference.addEventListener('change', onPreference);
  root.addEventListener('animationend', onAnimationEnd);
  root.addEventListener('animationcancel', onAnimationEnd);
  root.addEventListener('focusin', onFocus);
  disposers.push(
    () => preference.removeEventListener('change', onPreference),
    () => root.removeEventListener('animationend', onAnimationEnd),
    () => root.removeEventListener('animationcancel', onAnimationEnd),
    () => root.removeEventListener('focusin', onFocus),
  );

  // Sample panels: the CSS grid-template-rows transition handles height smoothly.
  // JS tracks seen state so re-opening never replays the entrance fade.
  root.querySelectorAll('details').forEach(details => {
    const sample = details.querySelector('.sample-full');
    const onToggle = () => {
      if (details.open) reveal(sample);
      else if (sample) finish(sample);
    };
    details.addEventListener('toggle', onToggle);
    disposers.push(() => details.removeEventListener('toggle', onToggle));
  });

  observe();
  return () => {
    stopped = true;
    stop();
    disposers.forEach(dispose => dispose());
  };
}
