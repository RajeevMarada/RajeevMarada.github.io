/* FINAL PERFORMANCE OPTIMIZED & POLISHED SCRIPT
   ================================================================================== */

'use strict';

let lenis;

// ============================================================================
// THEME MANAGER
// ============================================================================
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.apply();
    this.init();
  }
  apply() { document.documentElement.setAttribute('data-theme', this.theme); }
  init() {
    const btn = document.getElementById('theme-switch');
    if (btn) btn.addEventListener('click', () => this.toggle());
  }
  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.apply();
  }
}

// ============================================================================
// OPTIMIZED CUSTOM SCROLL BAR (SYNCED WITH LENIS RAF)
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
    // Debounce resize for performance
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.updateDimensions(), 200); // Increased debounce
    }, { passive: true });

    // SYNC UPDATE DIRECTLY WITH LENIS SCROLL EVENT FOR FLUIDITY
    lenis.on('scroll', ({ scroll }) => {
       if (!this.isDragging) {
           const thumbPos = scroll / this.scrollRatio;
           this.thumb.style.transform = `translate3d(0, ${thumbPos}px, 0)`;
       }
    });

    this.thumb.addEventListener('pointerdown', this.startDrag.bind(this));
    window.addEventListener('pointermove', this.onDrag.bind(this), { passive: false });
    window.addEventListener('pointerup', this.stopDrag.bind(this));
    this.track.addEventListener('click', this.onTrackClick.bind(this));
  }

  updateDimensions() {
    this.trackHeight = this.track.offsetHeight;
    this.docHeight = document.documentElement.scrollHeight;
    this.winHeight = window.innerHeight;
    this.thumbHeight = Math.max((this.winHeight / this.docHeight) * this.trackHeight, 30);
    this.thumb.style.height = `${this.thumbHeight}px`;
    this.scrollRatio = (this.docHeight - this.winHeight) / (this.trackHeight - this.thumbHeight);
    // Initial position update
    const thumbPos = lenis.scroll / this.scrollRatio;
    this.thumb.style.transform = `translate3d(0, ${thumbPos}px, 0)`;
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
    lenis.scrollTo(newThumbY * this.scrollRatio, { immediate: true });
    this.thumb.style.transform = `translate3d(0, ${newThumbY}px, 0)`;
  }

  stopDrag() {
    this.isDragging = false;
    document.body.style.userSelect = '';
    this.thumb.classList.remove('dragging');
  }

  onTrackClick(e) {
    if (e.target === this.thumb) return;
    const rect = this.track.getBoundingClientRect();
    const thumbY = (e.clientY - rect.top) - (this.thumbHeight / 2);
    lenis.scrollTo(Math.min(Math.max(0, thumbY), this.trackHeight - this.thumbHeight) * this.scrollRatio);
  }
}

// ============================================================================
// SMART MAGNETIC CURSOR (AUTO-HIDE & RESET)
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
    this.isActive = false;
    this.init();
  }

  init() {
    // Track mouse position and visibility
    window.addEventListener('pointermove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }, {passive: true});

    // Auto-hide on leave
    document.addEventListener('mouseleave', () => {
        this.cursor.style.opacity = '0';
        this.follower.style.opacity = '0';
    });

    // Show on enter and reset position instantly
    document.addEventListener('mouseenter', (e) => {
        this.cursor.style.opacity = '1';
        this.follower.style.opacity = '0.5';
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    });

    document.querySelectorAll('[data-magnet]').forEach(el => {
      el.addEventListener('mouseenter', () => this.activateMagnet(el));
      el.addEventListener('mouseleave', () => this.deactivateMagnet());
    });
     document.querySelectorAll('[data-magnet-small]').forEach(el => {
      el.addEventListener('mouseenter', () => this.activateMagnet(el, true));
      el.addEventListener('mouseleave', () => this.deactivateMagnet());
    });
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

    const delta = Math.abs(targetX - this.pos.x) + Math.abs(targetY - this.pos.y);
    if (delta < 0.1 && !this.activeMagnet) {
        this.isActive = false;
    } else {
        requestAnimationFrame(() => this.animate());
    }
  }
}

// ============================================================================
// UNIFIED DRAGGABLE MARQUEE (DESKTOP & MOBILE)
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
    this.lastX = 0;
    this.dragVelocity = 0;
    this.isVisible = false;
    this.itemWidth = 0;
    this.init();
  }

  init() {
    const originalContent = this.track.innerHTML;
    while (this.track.scrollWidth < window.innerWidth * 5) {
      this.track.insertAdjacentHTML('beforeend', originalContent);
    }
    this.measureItem();
    window.addEventListener('resize', () => this.measureItem(), {passive: true});

    const observer = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
        if (this.isVisible && !this.animationFrame) this.loop();
    });
    observer.observe(this.container);

    this.bindEvents();
  }

  measureItem() {
      const firstItem = this.track.querySelector('.ticker-item');
      const sep = this.track.querySelector('.sep');
      if (firstItem && sep) {
          this.itemWidth = firstItem.offsetWidth + sep.offsetWidth + 
                           parseInt(window.getComputedStyle(firstItem).marginLeft) * 2 +
                           parseInt(window.getComputedStyle(sep).marginLeft) * 2;
      }
  }

  bindEvents() {
    this.container.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      this.lastX = e.clientX;
      this.dragVelocity = 0;
      this.track.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      // Uniform drag sensitivity for both desktop and mobile
      const delta = (e.clientX - this.lastX) * 1.5;
      this.offset += delta;
      this.dragVelocity = delta;
      this.lastX = e.clientX;
      this.updateTrackPosition();
    }, { passive: false });

    window.addEventListener('pointerup', this.onDragEnd.bind(this));
    window.addEventListener('pointercancel', this.onDragEnd.bind(this));
  }

  onDragEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.track.style.cursor = 'grab';

      // Unified Snapping Logic for all devices
      if (Math.abs(this.dragVelocity) > 1) {
          const direction = Math.sign(this.dragVelocity);
          const currentItemIndex = Math.round(-this.offset / this.itemWidth);
          const targetIndex = currentItemIndex - direction;
          gsap.to(this, {
              offset: -targetIndex * this.itemWidth,
              duration: 0.6,
              ease: "power2.out",
              onUpdate: () => this.updateTrackPosition()
          });
      }
  }

  loop() {
    if (!this.isVisible) { this.animationFrame = null; return; }
    if (!this.isDragging) {
      this.offset -= this.speed + this.dragVelocity;
      this.dragVelocity *= 0.95;
    }
    this.updateTrackPosition();
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  updateTrackPosition() {
    const trackWidth = this.track.scrollWidth / 2;
    if (this.offset <= -trackWidth) this.offset += trackWidth;
    else if (this.offset > 0) this.offset -= trackWidth;
    this.track.style.transform = `translate3d(${this.offset}px, 0, 0)`;
  }
}

// ============================================================================
// OPTIMIZED OBSERVERS & HELPERS
// ============================================================================
class ScrollReveals {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => entry.target.classList.add('revealed'));
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-up, .reveal-side, .reveal-text').forEach(t => this.observer.observe(t));
  }
}

class ProjectObserver {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting !== entry.target.classList.contains('is-visible')) {
                     entry.target.classList.toggle('is-visible', entry.isIntersecting);
                }
            });
        }, { rootMargin: '10% 0px', threshold: 0 });
        document.querySelectorAll('.gallery-image-wrapper').forEach(t => this.observer.observe(t));
    }
}

class MobileTouchFix {
    constructor() {
        document.querySelectorAll('a, button, .kpi-stat, .exp-card, .education-item, .tech-tags li, .skill-category, .skill-tag, .award-card, .contact-item, .scroll-top-btn').forEach(el => {
            el.addEventListener('touchstart', () => el.classList.add('active-touch'), {passive: true});
            el.addEventListener('touchend', () => setTimeout(() => el.classList.remove('active-touch'), 150), {passive: true});
        });
    }
}

class Preloader {
  constructor() {
    this.preloader = document.getElementById('kinetic-preloader');
    this.progress = document.querySelector('.loader-progress');
    if (this.preloader) this.start();
  }
  start() {
    let width = 0;
    const update = () => {
        width += Math.random() * 2.5; 
        if (width > 100) width = 100;
        this.progress.style.width = width + '%';
        if (width < 100) requestAnimationFrame(update);
        else setTimeout(() => this.hide(), 200);
    };
    requestAnimationFrame(update);
  }
  hide() {
    gsap.to(this.preloader, {
      opacity: 0, duration: 0.8, ease: 'power2.inOut',
      onComplete: () => { 
          this.preloader.remove(); 
          document.body.classList.remove('loading'); 
          ScrollTrigger.refresh(); 
      }
    });
  }
}

class TiltEffect {
  constructor() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => requestAnimationFrame(() => this.handleMove(e, card)));
      card.addEventListener('mouseleave', () => this.handleLeave(card));
    });
  }
  handleMove(e, card) {
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -5;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }
  handleLeave(card) {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }
}

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
        this.container.scrollLeft = this.scrollLeft - (e.pageX - this.container.offsetLeft - this.startX) * 1.5;
      });
      this.container.addEventListener('scroll', () => requestAnimationFrame(() => this.updateThumb()), { passive: true });
      window.addEventListener('resize', () => this.updateThumb(), { passive: true });
      this.updateThumb();
  
      this.track.addEventListener('click', (e) => {
          if (e.target === this.thumb) return;
          const ratio = (e.clientX - this.track.getBoundingClientRect().left) / this.track.clientWidth;
          this.container.scrollTo({ left: ratio * (this.container.scrollWidth - this.container.clientWidth), behavior: 'smooth' });
      });
    }
    updateThumb() {
      const maxScroll = this.container.scrollWidth - this.container.clientWidth;
      const thumbWidth = (this.container.clientWidth / this.container.scrollWidth) * 100;
      this.thumb.style.width = `${thumbWidth}%`;
      this.thumb.style.left = `${(this.container.scrollLeft / maxScroll) * (100 - thumbWidth)}%`;
    }
  }

class ScrollTop {
  constructor() {
    this.btn = document.getElementById('scrollTop');
    if (!this.btn) return;
    lenis.on('scroll', ({ scroll }) => this.btn.classList.toggle('visible', scroll > 500));
    this.btn.addEventListener('click', () => lenis.scrollTo(0));
  }
}

function initParallax() {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.gallery-image-wrapper').forEach(wrapper => {
    gsap.to(wrapper.querySelector('.gallery-image'), {
      y: '15%', ease: 'none',
      scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  const navItems = document.querySelectorAll('.dock-item[href^="#"]');
  const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const id = entry.target.getAttribute('id');
              navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === `#${id}`));
          }
      });
  }, { rootMargin: '-10% 0px -80% 0px', threshold: [0, 0.5, 1] });
  document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true, touchMultiplier: 1.5,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  new ThemeManager(); new Preloader(); new VisibleScrollBar();
  new MagneticCursor(); new SeamlessMarquee(); new ScrollReveals();
  new ProjectObserver(); new MobileTouchFix(); new ExperienceScroll();
  new TiltEffect(); new ScrollTop(); initParallax(); lucide.createIcons();

  // Enhanced tool-tip dismissal
  document.querySelectorAll('.dock-item').forEach(item => {
      const dismissTooltip = () => {
          item.classList.add('tooltip-dismissed');
          // Ensure it stays hidden long enough for dragging/interacting to finish
          setTimeout(() => item.classList.remove('tooltip-dismissed'), 1500);
      };
      item.addEventListener('click', dismissTooltip);
      item.addEventListener('touchstart', dismissTooltip, {passive: true});
  });

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(c => {
          const t = parseFloat(c.getAttribute('data-target'));
          gsap.to(c, { textContent: t, duration: 2.5, ease: 'power2.out', snap: { textContent: 0.1 },
            onUpdate: function() { c.textContent = Number.isInteger(t) ? Math.round(this.targets()[0].textContent) : parseFloat(this.targets()[0].textContent).toFixed(1); }
          });
        });
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const kpi = document.querySelector('.kpi-dashboard');
  if (kpi) kpiObserver.observe(kpi);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) { e.preventDefault(); lenis.scrollTo(this.getAttribute('href')); });
  });
});