import { animate, createTimeline, createScope, stagger, svg } from 'animejs';

let scope: ReturnType<typeof createScope> | undefined;
let listeners: AbortController | undefined;
let observers: IntersectionObserver[] = [];
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function preference(key: string, fallback: string) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch {}
}

function reducedMotion() {
  return systemMotion.matches || preference('portfolio-motion', 'system') === 'reduced';
}

function cleanUp() {
  listeners?.abort();
  observers.forEach(observer => observer.disconnect());
  observers = [];
  scope?.revert();
  scope = undefined;
}

function initialize() {
  cleanUp();
  listeners = new AbortController();
  const { signal } = listeners;
  const reduced = reducedMotion();
  const theme = preference('portfolio-theme', 'dark');
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';

  const themeButton = document.querySelector<HTMLButtonElement>('.theme-button');
  const setThemeLabel = () => themeButton?.setAttribute('aria-label', `Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
  setThemeLabel();
  themeButton?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    savePreference('portfolio-theme', nextTheme);
    setThemeLabel();
  }, { signal });

  const motionButton = document.querySelector<HTMLButtonElement>('.motion-toggle');
  if (motionButton) {
    motionButton.textContent = systemMotion.matches ? 'Motion: reduced (system)' : `Motion: ${reduced ? 'reduced' : 'full'}`;
    motionButton.setAttribute('aria-pressed', String(reduced));
    motionButton.disabled = systemMotion.matches;
    motionButton.addEventListener('click', () => {
      savePreference('portfolio-motion', reduced ? 'full' : 'reduced');
      initialize();
    }, { signal });
  }

  const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const menu = document.querySelector<HTMLElement>('#mobile-nav');
  const closeMenu = () => {
    if (menu) menu.hidden = true;
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menu) menu.hidden = !open;
  }, { signal });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu, { signal }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  }, { signal });

  const updateProgress = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = document.querySelector<HTMLElement>('.reading-progress');
    if (progress) progress.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true, signal });
  window.addEventListener('resize', updateProgress, { passive: true, signal });
  updateProgress();

  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      let count = 0;
      document.querySelectorAll<HTMLElement>('[data-project-category]').forEach(card => {
        const show = button.dataset.filter === 'all' || card.dataset.projectCategory === button.dataset.filter;
        card.hidden = !show;
        if (show) {
          count++;
          card.style.opacity = '1';
          card.style.transform = 'none';
        }
      });
      const counter = document.querySelector('.filter-count');
      if (counter) counter.textContent = `${String(count).padStart(2,'0')} PROJECTS`;
      if (!reduced && scope) scope.add(() => { animate('[data-project-category]:not([hidden])', { opacity: [0,1], y: [16,0], duration: 450, delay: stagger(75), ease: 'out(3)' }); });
      updateProgress();
    }, { signal });
  });

  const benchmarks: Record<string, { baseline: number; cuda: number; label: string; note: string; comparison: string }> = {
    gliders: { baseline: 283.804, cuda: 1.186, label: 'Serial CPU', note: '2048 × 2048 grid · End-to-end timing', comparison: 'Serial CPU: 283.804 ms · CUDA: 1.186 ms.' },
    emboss: { baseline: 56.356, cuda: 2.512, label: 'Serial CPU', note: '2048 × 2048 image · End-to-end timing', comparison: 'Serial CPU: 56.356 ms · CUDA: 2.512 ms.' },
    histogram: { baseline: .671, cuda: 2.606, label: 'OpenMP', note: '5 million values · End-to-end timing', comparison: 'OpenMP: 0.671 ms · CUDA: 2.606 ms.' },
  };
  document.querySelectorAll<HTMLButtonElement>('[data-workload]').forEach(button => button.addEventListener('click', () => {
    const data = benchmarks[button.dataset.workload || 'gliders'];
    document.querySelectorAll('[data-workload]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const setText = (selector: string, text: string) => { const element = document.querySelector(selector); if (element) element.textContent = text; };
    setText('[data-baseline-label]', data.label);
    setText('[data-baseline-time]', `${data.baseline.toFixed(3)} ms`);
    setText('[data-cuda-time]', `${data.cuda.toFixed(3)} ms`);
    setText('[data-workload-note]', data.note);
    setText('[data-comparison]', data.comparison);
    const maximum = Math.max(data.baseline, data.cuda);
    [['[data-baseline-bar]', data.baseline], ['[data-cuda-bar]', data.cuda]].forEach(([selector,value]) => {
      const element = document.querySelector<HTMLElement>(String(selector));
      const width = `${Number(value) / maximum * 100}%`;
      if (element && !reduced && scope) scope.add(() => { animate(element, { width, duration: 650, ease: 'out(4)' }); });
      else if (element) element.style.width = width;
    });
  }, { signal }));

  if (reduced) {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => { element.style.opacity = '1'; element.style.transform = 'none'; });
    return;
  }

  scope = createScope({ root: document.body }).add(() => {
    if (document.querySelector('.hero')) {
      createTimeline({ defaults: { ease: 'out(4)' } })
        .add('[data-hero-kicker]', { opacity: [0,1], y: [12,0], duration: 550 }, 0)
        .add('.hero-title .line > span', { y: ['110%','0%'], opacity: [.2,1], duration: 1000, delay: stagger(140) }, 100)
        .add('[data-hero-detail]', { opacity: [0,1], y: [16,0], duration: 650, delay: stagger(100) }, 450)
        .add('[data-hero-visual]', { opacity: [0,1], scale: [.9,1], duration: 1300 }, 150);
    }

    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          scope?.add(() => { animate(entry.target, { opacity: [0,1], y: [25,0], duration: 750, ease: 'out(4)' }); });
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
    elements.forEach(element => { if (element.getBoundingClientRect().top > window.innerHeight) element.style.opacity = '0'; reveal.observe(element); });
    observers.push(reveal);

    const paths = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          scope?.add(() => { animate(svg.createDrawable(entry.target as SVGElement), { draw: ['0 0', '0 1'], duration: 1600, ease: 'inOut(3)' }); });
          paths.unobserve(entry.target);
        }
      });
    }, { threshold: .5 });
    document.querySelectorAll('.art-path').forEach(path => paths.observe(path));
    observers.push(paths);

    const wire = document.querySelector<SVGElement>('.orbital-wire');
    if (wire) {
      const rotation = animate(wire, { rotate: [0,360], duration: 100000, loop: true, ease: 'linear', autoplay: false });
      const visibility = new IntersectionObserver(entries => { entries.forEach(entry => entry.isIntersecting && !document.hidden ? rotation.resume() : rotation.pause()); });
      visibility.observe(wire);
      observers.push(visibility);
      document.addEventListener('visibilitychange', () => { if (document.hidden) rotation.pause(); else if (wire.getBoundingClientRect().bottom > 0) rotation.resume(); }, { signal });
    }

    const orbital = document.querySelector<HTMLElement>('[data-orbital]');
    if (orbital && window.matchMedia('(pointer:fine)').matches) {
      orbital.parentElement?.addEventListener('pointermove', event => {
        const pointer = event as PointerEvent;
        const bounds = orbital.getBoundingClientRect();
        orbital.style.transform = `translate(${(pointer.clientX - bounds.left - bounds.width / 2) * .035}px, ${(pointer.clientY - bounds.top - bounds.height / 2) * .035}px)`;
      }, { signal });
      orbital.parentElement?.addEventListener('pointerleave', () => { orbital.style.transform = 'none'; }, { signal });
    }
  });
}

document.addEventListener('astro:before-swap', cleanUp);
document.addEventListener('astro:page-load', initialize);
systemMotion.addEventListener('change', initialize);
