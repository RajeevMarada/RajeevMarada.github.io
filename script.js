/* POST-MVP 3.0 - SCROLL TO TOP ADDITION
   ================================================================================== */

'use strict';

// ============================================================================
// THEME MANAGER
// ============================================================================
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.apply();
    this.init();
  }

  apply() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  init() {
    const btn = document.getElementById('theme-switch');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.apply();
  }
}

// ============================================================================
// CUSTOM PAGE SCROLL BAR
// ============================================================================
class VisibleScrollBar {
  constructor() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    this.container = document.querySelector('.scroll-bar-container');
    this.track = document.querySelector('.scroll-bar-track');
    this.thumb = document.querySelector('.scroll-bar-thumb');
    if (!this.container || !this.track || !this.thumb) return;

    this.isDragging = false;
    this.startY = 0;
    this.startThumbY = 0;
    this.init();
  }

  init() {
    this.updateDimensions();
    window.addEventListener('resize', () => this.updateDimensions(), { passive: true });
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    this.thumb.addEventListener('pointerdown', this.startDrag.bind(this));
    window.addEventListener('pointermove', this.onDrag.bind(this), { passive: false });
    window.addEventListener('pointerup', this.stopDrag.bind(this));
    this.track.addEventListener('click', this.onTrackClick.bind(this));
  }

  updateDimensions() {
    this.trackHeight = this.track.offsetHeight;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    this.thumbHeight = Math.max((winHeight / docHeight) * this.trackHeight, 30);
    this.thumb.style.height = `${this.thumbHeight}px`;
    this.scrollRatio = (docHeight - winHeight) / (this.trackHeight - this.thumbHeight);
    this.onScroll();
  }

  onScroll() {
    if (this.isDragging) return;
    requestAnimationFrame(() => {
      const scrollPos = window.scrollY;
      const thumbPos = scrollPos / this.scrollRatio;
      this.thumb.style.transform = `translate3d(0, ${Math.min(Math.max(0, thumbPos), this.trackHeight - this.thumbHeight)}px, 0)`;
    });
  }

  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.startY = e.clientY;
    const style = window.getComputedStyle(this.thumb);
    const matrix = new WebKitCSSMatrix(style.transform);
    this.startThumbY = matrix.m42;
    document.body.style.userSelect = 'none';
    this.thumb.classList.add('dragging');
  }

  onDrag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    const deltaY = e.clientY - this.startY;
    const newThumbY = Math.min(Math.max(0, this.startThumbY + deltaY), this.trackHeight - this.thumbHeight);
    
    requestAnimationFrame(() => {
      this.thumb.style.transform = `translate3d(0, ${newThumbY}px, 0)`;
      window.scrollTo(0, newThumbY * this.scrollRatio);
    });
  }

  stopDrag() {
    this.isDragging = false;
    document.body.style.userSelect = '';
    this.thumb.classList.remove('dragging');
  }

  onTrackClick(e) {
    if (e.target === this.thumb) return;
    const rect = this.track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const thumbY = clickY - (this.thumbHeight / 2);
    window.scrollTo({
      top: Math.min(Math.max(0, thumbY), this.trackHeight - this.thumbHeight) * this.scrollRatio,
      behavior: 'smooth'
    });
  }
}

// ============================================================================
// MAGNETIC CURSOR
// ============================================================================
class MagneticCursor {
  constructor() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    this.cursor = document.querySelector('.magnetic-cursor');
    this.follower = document.querySelector('.cursor-follower');
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: this.pos.x, y: this.pos.y };
    this.speed = 0.6;
    this.activeMagnet = null;
    this.init();
  }

  init() {
    window.addEventListener('pointermove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; }, {passive: true});
    document.querySelectorAll('[data-magnet]').forEach(el => {
      el.addEventListener('mouseenter', () => this.activateMagnet(el));
      el.addEventListener('mouseleave', () => this.deactivateMagnet());
    });
     document.querySelectorAll('[data-magnet-small]').forEach(el => {
      el.addEventListener('mouseenter', () => this.activateMagnet(el, true));
      el.addEventListener('mouseleave', () => this.deactivateMagnet());
    });
    this.animate();
  }

  activateMagnet(el, isSmall = false) {
    this.activeMagnet = el;
    this.cursor.classList.add('cursor-hover-magnet');
    this.follower.classList.add('follower-hover-magnet');
    if (isSmall) this.cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
  }

  deactivateMagnet() {
    this.activeMagnet = null;
    this.cursor.classList.remove('cursor-hover-magnet');
    this.follower.classList.remove('follower-hover-magnet');
    this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  }

  animate() {
    let targetX = this.mouse.x, targetY = this.mouse.y;
    if (this.activeMagnet) {
      const rect = this.activeMagnet.getBoundingClientRect();
      targetX = rect.left + rect.width / 2 + (this.mouse.x - (rect.left + rect.width / 2)) * 0.2;
      targetY = rect.top + rect.height / 2 + (this.mouse.y - (rect.top + rect.height/2)) * 0.2;
    }
    this.pos.x += (targetX - this.pos.x) * this.speed;
    this.pos.y += (targetY - this.pos.y) * this.speed;
    this.cursor.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) translate(-50%, -50%)`;
    this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================================================
// SEAMLESS MARQUEE (MOBILE SCALED)
// ============================================================================
class SeamlessMarquee {
  constructor() {
    this.container = document.querySelector('.skills-ticker-container');
    this.track = document.querySelector('.skills-ticker-track');
    if (!this.container || !this.track) return;
    this.speed = 0.5;
    this.offset = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.dragVelocity = 0;
    this.init();
  }

  init() {
    const originalContent = this.track.innerHTML;
    while (this.track.scrollWidth < window.innerWidth * 5) {
      this.track.insertAdjacentHTML('beforeend', originalContent);
    }
    this.loop();
    this.bindEvents();
  }

  bindEvents() {
    this.container.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.lastX = e.clientX;
      this.dragVelocity = 0;
      this.track.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = Math.abs(e.clientX - this.startX);
      const deltaY = Math.abs(e.clientY - this.startY);
      if (deltaY > deltaX) {
          this.isDragging = false;
          this.track.style.cursor = 'grab';
          return;
      }
      e.preventDefault();
      const isMobile = window.innerWidth < 768;
      const dragMultiplier = isMobile ? 1.5 : 1.0;
      const delta = (e.clientX - this.lastX) * dragMultiplier;
      this.offset += delta;
      this.dragVelocity = delta;
      this.lastX = e.clientX;
    }, { passive: false });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
      this.track.style.cursor = 'grab';
    });
    window.addEventListener('pointercancel', () => {
        this.isDragging = false;
        this.track.style.cursor = 'grab';
    });
  }

  loop() {
    if (!this.isDragging) {
      this.offset -= this.speed + this.dragVelocity;
      this.dragVelocity *= 0.95;
    }
    const trackWidth = this.track.scrollWidth / 2;
    if (this.offset <= -trackWidth) this.offset += trackWidth;
    else if (this.offset > 0) this.offset -= trackWidth;

    this.track.style.transform = `translate3d(${this.offset}px, 0, 0)`;
    requestAnimationFrame(() => this.loop());
  }
}

// ============================================================================
// SCROLL REVEALS
// ============================================================================
class ScrollReveals {
  constructor() {
    this.options = { root: null, rootMargin: '0px', threshold: 0.15 };
    this.observer = new IntersectionObserver(this.onIntersect.bind(this), this.options);
    this.targets = document.querySelectorAll('.reveal-up, .reveal-side, .reveal-text');
    this.init();
  }
  init() { this.targets.forEach(target => this.observer.observe(target)); }
  onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================================================================
// UNIFIED PROJECT OBSERVER
// ============================================================================
class ProjectObserver {
    constructor() {
        this.options = { root: null, rootMargin: '-25% 0px -25% 0px', threshold: 0.5 };
        this.observer = new IntersectionObserver(this.onIntersect.bind(this), this.options);
        this.targets = document.querySelectorAll('.gallery-image-wrapper');
        this.init();
    }
    init() { this.targets.forEach(target => this.observer.observe(target)); }
    onIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
            else entry.target.classList.remove('is-visible');
        });
    }
}

// ============================================================================
// MOBILE TOUCH FIX
// ============================================================================
class MobileTouchFix {
    constructor() {
        this.targets = document.querySelectorAll('a, button, .kpi-stat, .exp-card, .education-item, .tech-tags li, .skill-category, .skill-tag, .award-card, .contact-item, .scroll-top-btn');
        this.init();
    }
    init() {
        this.targets.forEach(el => {
            el.addEventListener('touchstart', () => el.classList.add('active-touch'), {passive: true});
            el.addEventListener('touchend', () => setTimeout(() => el.classList.remove('active-touch'), 150), {passive: true});
            el.addEventListener('touchcancel', () => el.classList.remove('active-touch'), {passive: true});
        });
    }
}

// ============================================================================
// PRELOADER
// ============================================================================
class Preloader {
  constructor() {
    this.preloader = document.getElementById('kinetic-preloader');
    this.progress = document.querySelector('.loader-progress');
    if (!this.preloader) return;
    this.start();
  }
  start() {
    let width = 0;
    const interval = setInterval(() => {
      width += Math.random() * 15;
      if (width > 100) width = 100;
      this.progress.style.width = width + '%';
      if (width === 100) {
        clearInterval(interval);
        setTimeout(() => this.hide(), 500);
      }
    }, 100);
  }
  hide() {
    gsap.to(this.preloader, {
      opacity: 0, duration: 0.8, ease: 'power2.inOut',
      onComplete: () => { this.preloader.remove(); document.body.classList.remove('loading'); ScrollTrigger.refresh(); }
    });
  }
}

// ============================================================================
// 3D TILT EFFECT
// ============================================================================
class TiltEffect {
  constructor() {
    if (window.matchMedia('(hover: none)').matches) return;
    this.cards = document.querySelectorAll('[data-tilt]');
    this.init();
  }
  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.handleMove(e, card));
      card.addEventListener('mouseleave', () => this.handleLeave(card));
    });
  }
  handleMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }
  handleLeave(card) {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }
}

// ============================================================================
// EXPERIENCE SCROLL
// ============================================================================
class ExperienceScroll {
    constructor() {
      this.container = document.getElementById('experienceContainer');
      this.track = document.getElementById('expScrollbarTrack');
      this.thumb = document.getElementById('expScrollbarThumb');
      if (!this.container || !this.track) return;
      this.isDown = false; this.startX = 0; this.scrollLeft = 0;
      this.init();
    }
    init() {
      this.container.addEventListener('pointerdown', (e) => {
        this.isDown = true;
        this.container.classList.add('is-dragging');
        this.startX = e.pageX - this.container.offsetLeft;
        this.scrollLeft = this.container.scrollLeft;
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => 
          this.container.addEventListener(evt, () => {
              this.isDown = false;
              this.container.classList.remove('is-dragging');
          })
      );
      this.container.addEventListener('pointermove', (e) => {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.container.offsetLeft;
        const walk = (x - this.startX) * 1.5;
        this.container.scrollLeft = this.scrollLeft - walk;
      });
  
      this.container.addEventListener('scroll', () => this.updateThumb());
      window.addEventListener('resize', () => this.updateThumb());
      this.updateThumb();
  
      this.track.addEventListener('click', (e) => {
          if (e.target === this.thumb) return;
          const rect = this.track.getBoundingClientRect();
          const clickRatio = (e.clientX - rect.left) / rect.width;
          this.container.scrollTo({ left: clickRatio * (this.container.scrollWidth - this.container.clientWidth), behavior: 'smooth' });
      });

      let thumbDown = false, thumbStartX = 0, thumbStartLeft = 0;
      this.thumb.addEventListener('pointerdown', (e) => {
          thumbDown = true;
          thumbStartX = e.clientX;
          thumbStartLeft = this.container.scrollLeft;
          this.thumb.classList.add('dragging');
          e.stopPropagation();
      });
      window.addEventListener('pointerup', () => { thumbDown = false; this.thumb.classList.remove('dragging'); });
      window.addEventListener('pointermove', (e) => {
          if(!thumbDown) return;
          e.preventDefault();
          const delta = e.clientX - thumbStartX;
          const trackWidth = this.track.clientWidth;
          const scrollableWidth = this.container.scrollWidth - this.container.clientWidth;
          const ratio = scrollableWidth / trackWidth;
          this.container.scrollLeft = thumbStartLeft + (delta * ratio);
      });
    }
  
    updateThumb() {
      const { scrollLeft, scrollWidth, clientWidth } = this.container;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) { this.thumb.style.width = '100%'; this.thumb.style.left = '0%'; return; }
      const thumbWidth = (clientWidth / scrollWidth) * 100;
      const thumbLeft = (scrollLeft / maxScroll) * (100 - thumbWidth);
      this.thumb.style.width = `${thumbWidth}%`;
      this.thumb.style.left = `${thumbLeft}%`;
    }
  }

// ============================================================================
// SCROLL TO TOP
// ============================================================================
class ScrollTop {
  constructor(lenisInstance) {
    this.btn = document.getElementById('scrollTop');
    this.lenis = lenisInstance;
    if (!this.btn) return;
    this.init();
  }
  init() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) this.btn.classList.add('visible');
      else this.btn.classList.remove('visible');
    }, { passive: true });
    this.btn.addEventListener('click', () => {
      if (this.lenis) this.lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============================================================================
// PARALLAX & INITIALIZATION
// ============================================================================
function initParallax() {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.gallery-image-wrapper').forEach(wrapper => {
    gsap.to(wrapper.querySelector('.gallery-image'), {
      y: '20%', ease: 'none',
      scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.dock-item[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - section.clientHeight / 3) current = section.getAttribute('id');
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) item.classList.add('active');
    });
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new Preloader();
  new VisibleScrollBar();
  new MagneticCursor();
  new SeamlessMarquee();
  new ScrollReveals();
  new ProjectObserver();
  new MobileTouchFix();
  new ExperienceScroll();
  new TiltEffect();
  initParallax();
  lucide.createIcons();

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          gsap.to(counter, {
            textContent: target, duration: 2.5, ease: 'power2.out', snap: { textContent: 0.1 },
            onUpdate: function() { counter.textContent = Number.isInteger(target) ? Math.round(this.targets()[0].textContent) : parseFloat(this.targets()[0].textContent).toFixed(1); }
          });
        });
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const kpiSection = document.querySelector('.kpi-dashboard');
  if (kpiSection) kpiObserver.observe(kpiSection);

  const lenis = new Lenis({ duration: 0.9, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothTouch: false });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) { e.preventDefault(); lenis.scrollTo(this.getAttribute('href')); });
  });

  new ScrollTop(lenis); // Initialize ScrollTop with Lenis instance
});
