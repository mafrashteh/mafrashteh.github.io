(() => {
  'use strict';
  const body = document.body;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'باز کردن منو');
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
  };
  const openMenu = () => {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-label', 'بستن منو');
    nav.classList.add('is-open');
    body.classList.add('menu-open');
  };
  menu?.addEventListener('click', () => menu.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu());
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (nav?.classList.contains('is-open') && !nav.contains(e.target) && !menu?.contains(e.target)) closeMenu();
  });
  window.matchMedia('(min-width: 901px)').addEventListener?.('change', e => { if (e.matches) closeMenu(); });

  const progress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--progress', (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + '%');
  };
  progress();
  addEventListener('scroll', progress, { passive: true });
  addEventListener('resize', progress);

  const reveals = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const highlight = document.querySelector('.highlight-on-scroll');
  if (highlight && 'IntersectionObserver' in window) {
    const hObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        highlight.classList.add('is-highlighted');
        hObs.disconnect();
      }
    }, { threshold: .6 });
    hObs.observe(highlight);
  } else {
    highlight?.classList.add('is-highlighted');
  }

  const revision = document.querySelector('[data-revision]');
  if (revision && 'IntersectionObserver' in window && !reduced) {
    const rObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        revision.classList.add('is-animated');
        rObs.disconnect();
      }
    }, { threshold: .5 });
    rObs.observe(revision);
  }

  const typing = document.querySelector('[data-typing]');
  if (typing) {
    const full = typing.dataset.typing || '';
    if (reduced) {
      typing.textContent = full;
    } else {
      let started = false;
      const type = () => {
        if (started) return;
        started = true;
        let i = 0;
        const tick = () => {
          typing.textContent = full.slice(0, i);
          if (i < full.length) {
            i++;
            setTimeout(tick, i < 12 ? 52 : 31);
          }
        };
        tick();
      };
      if ('IntersectionObserver' in window) {
        const tObs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            type();
            tObs.disconnect();
          }
        }, { threshold: .5 });
        tObs.observe(typing);
      } else {
        type();
      }
    }
  }

  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('section[id]')];
    const sObs = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sObs.observe(section));
  }

  const year = document.querySelector('#year');
  if (year) {
    year.textContent = new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(new Date().getFullYear());
  }
})();