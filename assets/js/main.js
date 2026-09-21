(() => {
  'use strict';

  const body = document.body;
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const tabs = [...document.querySelectorAll('.work-tab')];
  const cards = [...document.querySelectorAll('.project-card')];
  const accordionButtons = [...document.querySelectorAll('.process-item button')];
  const year = document.querySelector('#year');

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'باز کردن منو');
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
  };

  const openMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'بستن منو');
    nav.classList.add('is-open');
    body.classList.add('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    menuButton.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', event => {
    if (!nav?.classList.contains('is-open')) return;
    if (nav.contains(event.target) || menuButton?.contains(event.target)) return;
    closeMenu();
  });

  const desktopMedia = window.matchMedia('(min-width: 921px)');
  desktopMedia.addEventListener?.('change', event => {
    if (event.matches) closeMenu();
  });

  tabs.forEach((tab, index) => {
    tab.setAttribute('aria-selected', String(index === 0));
    tab.tabIndex = index === 0 ? 0 : -1;

    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter || 'all';

      tabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });

      cards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    });

    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();

      const current = tabs.indexOf(tab);
      let next = current;
      if (event.key === 'ArrowRight') next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowLeft') next = (current + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;

      tabs[next].focus();
      tabs[next].click();
    });
  });

  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.process-item');
      if (!item) return;
      const wasOpen = item.classList.contains('is-open');

      document.querySelectorAll('.process-item').forEach(el => {
        el.classList.remove('is-open');
        const btn = el.querySelector('button');
        btn?.setAttribute('aria-expanded', 'false');
        const icon = btn?.querySelector('i');
        if (icon) icon.textContent = '+';
      });

      if (!wasOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        const icon = button.querySelector('i');
        if (icon) icon.textContent = '−';
      }
    });
  });

  if (year) {
    year.textContent = new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(new Date().getFullYear());
  }

  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('section[id]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }
})();