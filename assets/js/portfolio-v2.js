(() => {
  'use strict';
  const body=document.body;
  const menu=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.site-nav');
  const navLinks=[...document.querySelectorAll('.site-nav a')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu=()=>{
    if(!menu||!nav)return;
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','باز کردن منو');
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
  };
  menu?.addEventListener('click',()=>{
    const open=menu.getAttribute('aria-expanded')==='true';
    if(open){closeMenu();return;}
    menu.setAttribute('aria-expanded','true');
    menu.setAttribute('aria-label','بستن منو');
    nav.classList.add('is-open');
    body.classList.add('menu-open');
  });
  navLinks.forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  const progress=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    document.documentElement.style.setProperty('--progress',(max>0?Math.min(100,scrollY/max*100):0)+'%');
  };
  progress();
  addEventListener('scroll',progress,{passive:true});
  addEventListener('resize',progress);

  const reveals=document.querySelectorAll('.reveal');
  if(!reduced&&'IntersectionObserver'in window){
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    }),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    reveals.forEach(el=>obs.observe(el));
  }else{
    reveals.forEach(el=>el.classList.add('is-visible'));
  }

  const copyLab=document.querySelector('[data-copy-lab]');
  if(copyLab){
    const tabs=[...copyLab.querySelectorAll('[data-copy-tab]')];
    const slides=[...copyLab.querySelectorAll('[data-copy-slide]')];
    let active=0;
    let timer;

    const animateSlide=slide=>{
      slides.forEach(x=>x.classList.remove('is-editing','is-edited'));
      if(reduced){slide.classList.add('is-edited');return;}
      slide.classList.add('is-editing');
      setTimeout(()=>slide.classList.add('is-edited'),900);
    };

    const show=index=>{
      active=(index+slides.length)%slides.length;
      tabs.forEach((tab,i)=>{
        const on=i===active;
        tab.classList.toggle('is-active',on);
        tab.setAttribute('aria-selected',String(on));
      });
      slides.forEach((slide,i)=>{
        const on=i===active;
        slide.hidden=!on;
        slide.classList.toggle('is-active',on);
      });
      animateSlide(slides[active]);
    };

    const autoplay=()=>{
      if(reduced)return;
      clearInterval(timer);
      timer=setInterval(()=>show(active+1),5200);
    };

    tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{show(i);autoplay()}));
    show(0);
    autoplay();
  }

  if('IntersectionObserver'in window){
    const sections=[...document.querySelectorAll('section[id]')];
    const sObs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      navLinks.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')==='#'+entry.target.id));
    }),{rootMargin:'-35% 0px -55% 0px'});
    sections.forEach(section=>sObs.observe(section));
  }

  const year=document.querySelector('#year');
  if(year)year.textContent=new Intl.NumberFormat('fa-IR',{useGrouping:false}).format(new Date().getFullYear());
})();