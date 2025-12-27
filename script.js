'use strict';

/* =====================================================
   CONFIG
===================================================== */
const CONFIG = {
  headerHideOffset: 200,
  scrollOffset: 120,
  counterDuration: 1800
};

/* =====================================================
   APP
===================================================== */
class CyprusWebsite {
  constructor() {
    this.cache();
    this.state();
    this.bind();
    this.init();
  }

  /* ---------- CACHE ---------- */
  cache() {
    this.body = document.body;
    this.header = document.querySelector('.header');
    this.nav = document.querySelector('.nav');
    this.menuBtn = document.querySelector('.mobile-menu-btn');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section');
    this.reveals = document.querySelectorAll('.reveal');
    this.stats = document.querySelectorAll('.stat-number');
    this.scrollTop = document.querySelector('.scroll-top');
  }

  /* ---------- STATE ---------- */
  state() {
    this.lastScroll = 0;
    this.menuOpen = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ticking = false;
  }

  /* ---------- INIT ---------- */
  init() {
    this.initReveal();
    this.initStats();
    this.initLazyImages();
    this.updateYear();
  }

  /* =====================================================
     EVENTS
  ===================================================== */
  bind() {
    window.addEventListener('scroll', () => this.onScroll());
    window.addEventListener('resize', () => this.onResize());

    this.menuBtn?.addEventListener('click', () => this.toggleMenu());

    this.navLinks.forEach(link =>
      link.addEventListener('click', e => this.onNavClick(e))
    );

    this.scrollTop?.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* =====================================================
     SCROLL
  ===================================================== */
  onScroll() {
    if (this.ticking) return;

    this.ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;

      this.updateHeader(y);
      this.updateActiveLink(y);
      this.updateScrollTop(y);

      this.lastScroll = y;
      this.ticking = false;
    });
  }

  updateHeader(y) {
    if (!this.header) return;

    this.header.classList.toggle('scrolled', y > 50);

    if (y > CONFIG.headerHideOffset && y > this.lastScroll && !this.menuOpen) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }
  }

  updateActiveLink(y) {
    const offset = y + CONFIG.scrollOffset;
    let current = '';

    this.sections.forEach(sec => {
      if (offset >= sec.offsetTop && offset < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
      }
    });

    this.navLinks.forEach(link =>
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`)
    );
  }

  updateScrollTop(y) {
    this.scrollTop?.classList.toggle('visible', y > 400);
  }

  /* =====================================================
     NAV
  ===================================================== */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.nav?.classList.toggle('active');
    this.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  onNavClick(e) {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;

    this.toggleMenu();

    const offset = this.header?.offsetHeight || 0;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  }

  /* =====================================================
     REVEAL
  ===================================================== */
  initReveal() {
    if (this.reducedMotion || !('IntersectionObserver' in window)) {
      this.reveals.forEach(el => el.classList.add('active'));
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('active');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    this.reveals.forEach(el => io.observe(el));
  }

  /* =====================================================
     STATS
  ===================================================== */
  initStats() {
    if (!this.stats.length || this.reducedMotion) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          this.animateCounter(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });

    this.stats.forEach(el => io.observe(el));
  }

  animateCounter(el) {
    const target = parseInt(el.dataset.value || el.textContent.replace(/\D/g, ''), 10);
    let start = 0;
    const startTime = performance.now();

    const step = now => {
      const progress = Math.min((now - startTime) / CONFIG.counterDuration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString();

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  /* =====================================================
     IMAGES
  ===================================================== */
  initLazyImages() {
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.src = e.target.dataset.src;
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '100px' });

    imgs.forEach(img => io.observe(img));
  }

  /* =====================================================
     UTILS
  ===================================================== */
  updateYear() {
    document.querySelectorAll('.current-year')
      .forEach(el => el.textContent = new Date().getFullYear());
  }

  onResize() {
    if (window.innerWidth > 768 && this.menuOpen) this.toggleMenu();
  }
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  window.CyprusApp = new CyprusWebsite();
});
