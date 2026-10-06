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
  function reveal(element, delay = 0) {
    if (!element || stopped || seen.has(element)) return;
    seen.add(element);
    // Keyboard users and reduced-motion readers always get the resting state.
    if (preference.matches || element.contains(document.activeElement)) return;
    active.add(element);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    element.classList.add('motion-reveal');
  }
  function observe() {
    if (stopped || preference.matches) return;
    const nextObserver = new IntersectionObserver(entries => {
      if (stopped || preference.matches || observer !== nextObserver) return;
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      for (const [index, { target, isIntersecting, boundingClientRect }] of visible.entries()) {
        if (!isIntersecting || seen.has(target)) continue;
        nextObserver.unobserve(target);
        if (boundingClientRect.bottom <= 0) { seen.add(target); continue; }
        reveal(target, Math.min(index * 35, 70));
      }
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
    observer = nextObserver;
    // Observe existing content blocks; never wrap or split the page's text.
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
  const onAnimationEnd = event => {
    if (event.animationName === 'portfolio-reveal') finish(event.target);
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
