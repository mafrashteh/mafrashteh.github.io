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


  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    document.documentElement.style.setProperty('--scroll-progress', pct + '%');
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const revealGroups = [
    '.section-title',
    '.service-card',
    '.about-art',
    '.about-copy',
    '.project-card',
    '.process-copy',
    '.process-item',
    '.why-grid article',
    '.faq-heading',
    '.faq-list details',
    '.contact-box',
    '.trust-item'
  ];

  revealGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.dataset.reveal = '';
      el.dataset.delay = String((index % 4) + 1);
    });
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed'));
  }

  const writeTargets = [
    '.section-title h2',
    '.about-copy h2',
    '.process-copy h2',
    '.faq-heading h2',
    '.contact-copy h2'
  ];
  writeTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.classList.add('scroll-write'));
  });

  if ('IntersectionObserver' in window) {
    const writeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-written');
        writeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    document.querySelectorAll('.scroll-write').forEach(el => writeObserver.observe(el));
  } else {
    document.querySelectorAll('.scroll-write').forEach(el => el.classList.add('is-written'));
  }

  const typeTarget = document.querySelector('.hero-tag');
  if (typeTarget && !reduceMotion) {
    const dot = typeTarget.querySelector('i');
    const textNode = [...typeTarget.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (textNode) {
      const full = textNode.textContent.trim();
      textNode.textContent = '';
      typeTarget.classList.add('typewriter');
      let i = 0;
      const type = () => {
        textNode.textContent = ' ' + full.slice(0, i);
        if (i < full.length) {
          i += 1;
          setTimeout(type, i < 8 ? 55 : 38);
        } else {
          typeTarget.classList.add('is-done');
        }
      };
      setTimeout(type, 450);
    }
  }

  const heroArt = document.querySelector('.hero-art');
  const heroIllustration = document.querySelector('.hero-illustration');
  if (heroArt && heroIllustration && !reduceMotion) {
    heroArt.addEventListener('pointermove', event => {
      const rect = heroArt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      heroIllustration.style.transform = `translate3d(${x * 10}px,${y * 10}px,0) rotateX(${-y * 1.3}deg) rotateY(${x * 1.3}deg)`;
    });
    heroArt.addEventListener('pointerleave', () => {
      heroIllustration.style.transform = '';
    });
  }

  const tiltTargets = document.querySelectorAll('.service-card,.project-card,.why-grid article');
  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    tiltTargets.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
        const rx = (0.5 - py) * 4;
        const ry = (px - 0.5) * 5;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    const orb = document.createElement('div');
    orb.className = 'cursor-orb';
    orb.setAttribute('aria-hidden', 'true');
    document.body.prepend(orb);
    document.body.classList.add('has-pointer');

    let tx = -500, ty = -500, cx = tx, cy = ty;
    document.addEventListener('pointermove', event => {
      tx = event.clientX;
      ty = event.clientY;
    }, { passive: true });

    const animateOrb = () => {
      cx += (tx - cx) * .11;
      cy += (ty - cy) * .11;
      orb.style.left = cx + 'px';
      orb.style.top = cy + 'px';
      requestAnimationFrame(animateOrb);
    };
    animateOrb();
  }
})();