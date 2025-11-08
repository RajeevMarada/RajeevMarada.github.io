/* FINAL PRE-MVP KINETIC PORTFOLIO v18.0 - SCRIPT
   Super fast responsive experience section scroll bar
   ================================================================================== */
'use strict';

// THEME
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

// VISIBLE SCROLL BAR - INSTANT RESPONSIVE
// VISIBLE SCROLL BAR - INSTANT & PRECISE
// VISIBLE SCROLL BAR — pointer events + cached geometry + RAF
// VISIBLE SCROLL BAR — fixed RAF loop + live syncing
class VisibleScrollBar {
  constructor() {
    this.container = document.querySelector('.scroll-bar-container');
    this.track = document.querySelector('.scroll-bar-track');
    this.thumb = document.querySelector('.scroll-bar-thumb');
    if (!this.container || !this.track || !this.thumb) return;

    this.isDragging = false;
    this.ptrY = 0;
    this.trackRect = null;
    this.thumbPx = 0;
    this.totalScrollY = 0;
    this.movable = 1;
    this.startScrollY = 0;
    this.startY = 0;
    this._rafId = null;

    this.init();
  }

  init() {
    this.thumb.style.willChange = 'top, height';
    window.addEventListener('scroll', () => this.updateBar(), { passive: true });
    window.addEventListener('resize', () => this.updateBar(), { passive: true });

    // Pointer events
    this.thumb.addEventListener('pointerdown', (e) => this.startDrag(e));
    // Listen on both the thumb (due to pointer capture) and window (for safety)
    this.thumb.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
    window.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
    window.addEventListener('pointerup', () => this.stopDrag());

    this.track.addEventListener('pointerdown', (e) => this.onTrackJump(e));
    this.updateBar();
  }

  updateBar() {
    const doc = document.documentElement;
    const totalHeight = Math.max(0, doc.scrollHeight - window.innerHeight);

    if (totalHeight === 0) {
      this.thumb.style.top = '0%';
      this.thumb.style.height = '100%';
      return;
    }

    const thumbHeightPct = Math.max((window.innerHeight / doc.scrollHeight) * 100, 10);
    const maxTopPct = 100 - thumbHeightPct;
    const scrolledRatio = window.scrollY / totalHeight; // 0..1
    const topPct = Math.min(maxTopPct, Math.max(0, scrolledRatio * maxTopPct));

    this.thumb.style.height = thumbHeightPct + '%';
    this.thumb.style.top = topPct + '%';
  }

  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.thumb.setPointerCapture?.(e.pointerId);
    this.container.classList.add('dragging');
    document.body.classList.add('no-select');

    // Pause Lenis for instant updates
    if (window.lenis?.stop) window.lenis.stop();

    // Cache geometry
    this.trackRect = this.track.getBoundingClientRect();
    this.thumbPx = this.thumb.offsetHeight;

    const doc = document.documentElement;
    this.totalScrollY = Math.max(0, doc.scrollHeight - window.innerHeight);
    this.movable = Math.max(1, this.trackRect.height - this.thumbPx);

    this.startY = e.clientY;
    this.ptrY = e.clientY;
    this.startScrollY = window.scrollY;
    __forwardCursorMove(this.ptrY ? e.clientX : 0, this.ptrY);

    this._startRAF();
    document.body.classList.add('hide-custom-cursor');
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    e.preventDefault(); // stop page gestures while dragging the custom bar
    this.ptrY = e.clientY;
    __forwardCursorMove(e.clientX, e.clientY);
  }

  _startRAF() {
    const loop = () => {
      if (!this.isDragging) return;
      const deltaY = this.ptrY - this.startY;
      const ratio = this.totalScrollY / this.movable;
      const newScrollY = Math.max(0, Math.min(this.totalScrollY, this.startScrollY + deltaY * ratio));

      window.scrollTo(0, newScrollY); // instant
      this.updateBar();               // keep thumb in sync
      
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  stopDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.classList.remove('dragging');
    document.body.classList.remove('no-select');

    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;

    if (window.lenis?.start) window.lenis.start(); // resume Lenis
    this.updateBar(); // final sync
    document.body.classList.remove('hide-custom-cursor');
  }

  onTrackJump(e) {
    if (e.target === this.thumb) return;

    const rect = this.track.getBoundingClientRect();
    const doc = document.documentElement;
    const totalHeight = Math.max(0, doc.scrollHeight - window.innerHeight);
    if (totalHeight === 0) return;

    const thumbPx = this.thumb.offsetHeight;
    const movable = Math.max(1, rect.height - thumbPx);
    const clickY = e.clientY - rect.top;
    const ratio = Math.min(1, Math.max(0, (clickY - thumbPx / 2) / movable));

    window.scrollTo({ top: ratio * totalHeight, behavior: 'smooth' });
  }
}



// EXPERIENCE SCROLLBAR - SUPER FAST & RESPONSIVE
// EXPERIENCE SCROLLBAR - SUPER FAST & RESPONSIVE (with safer selectors)
// EXPERIENCE SCROLLBAR — pointer events + cached geometry + RAF
// EXPERIENCE SCROLLBAR — fixed RAF loop + live syncing
class ExperienceScrollbar {
  constructor() {
    this.container =
      document.getElementById('experienceContainer') ||
      document.querySelector('.experience-snap-container');

    this.scrollbarTrack = document.querySelector('.exp-scrollbar-track');
    this.scrollbarThumb =
      document.getElementById('expScrollbarThumb') ||
      document.querySelector('.exp-scrollbar-thumb');

    if (!this.container || !this.scrollbarTrack || !this.scrollbarThumb) return;

    this.isDragging = false;
    this.ptrX = 0;
    this.ptrY = 0;                         // ⬅ added
    this.trackRect = null;
    this.thumbPx = 0;
    this.totalScroll = 0;
    this.movable = 1;
    this.startScrollLeft = 0;
    this.startX = 0;
    this._rafId = null;

    this.init();
  }

  init() {
    this.scrollbarThumb.style.willChange = 'left, width';

    this.container.addEventListener('scroll', () => this.updateScrollbar(), { passive: true });
    window.addEventListener('resize', () => this.updateScrollbar(), { passive: true });

    this.scrollbarThumb.addEventListener('pointerdown', (e) => this.startDrag(e));
    // capture on both the thumb and window
    this.scrollbarThumb.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
    window.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
    window.addEventListener('pointerup', () => this.stopDrag());

    this.scrollbarTrack.addEventListener('pointerdown', (e) => this.onTrackJump(e));
    this.updateScrollbar();
  }

  updateScrollbar() {
    const { scrollLeft, scrollWidth, clientWidth } = this.container;

    if (scrollWidth <= clientWidth) {
      this.scrollbarThumb.style.left = '0%';
      this.scrollbarThumb.style.width = '100%';
      return;
    }

    const thumbWidthPct = Math.max((clientWidth / scrollWidth) * 100, 15);
    const maxLeftPct = 100 - thumbWidthPct;
    const scrollPct = scrollLeft / (scrollWidth - clientWidth);
    const leftPct = Math.min(maxLeftPct, Math.max(0, scrollPct * maxLeftPct));

    this.scrollbarThumb.style.width = thumbWidthPct + '%';
    this.scrollbarThumb.style.left = leftPct + '%';
  }

  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.scrollbarThumb.setPointerCapture?.(e.pointerId);
    this.scrollbarThumb.classList.add('dragging');
    document.body.classList.add('no-select');

    // Cache geometry
    this.trackRect = this.scrollbarTrack.getBoundingClientRect();
    this.thumbPx = this.scrollbarThumb.offsetWidth;
    this.totalScroll = Math.max(0, this.container.scrollWidth - this.container.clientWidth);
    this.movable = Math.max(1, this.trackRect.width - this.thumbPx);

    this.startX = e.clientX;
    this.ptrX = e.clientX;
    this.ptrY = e.clientY;                 // ⬅ added
    this.startScrollLeft = this.container.scrollLeft;

    __forwardCursorMove(this.ptrX, this.ptrY); // ⬅ added

    this._startRAF();
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.ptrX = e.clientX;
    this.ptrY = e.clientY;                 // ⬅ added
    __forwardCursorMove(this.ptrX, this.ptrY); // ⬅ added
  }

  _startRAF() {
    const loop = () => {
      if (!this.isDragging) return;
      const deltaX = this.ptrX - this.startX;
      const ratio = this.totalScroll / this.movable;
      const newScrollLeft = Math.max(0, Math.min(this.totalScroll, this.startScrollLeft + deltaX * ratio));

      this.container.scrollLeft = newScrollLeft; // instant
      this.updateScrollbar();                    // keep thumb in sync

      __forwardCursorMove(this.ptrX, this.ptrY); // ⬅ added (keeps cursor synced even if events throttle)

      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  stopDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.scrollbarThumb.classList.remove('dragging');
    document.body.classList.remove('no-select');

    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;

    this.updateScrollbar(); // final sync
  }

  onTrackJump(e) {
    if (e.target === this.scrollbarThumb) return;

    const rect = this.scrollbarTrack.getBoundingClientRect();
    const thumbPx = this.scrollbarThumb.offsetWidth;
    const movable = Math.max(1, rect.width - thumbPx);
    const clickX = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, (clickX - thumbPx / 2) / movable));

    this.container.scrollTo({
      left: ratio * (this.container.scrollWidth - this.container.clientWidth),
      behavior: 'smooth'
    });
  }
}



// CURSOR
class MagneticCursor {
  constructor() {
    this.cursor = document.querySelector('.magnetic-cursor');
    this.follower = document.querySelector('.cursor-follower');
    this.x = 0;
    this.y = 0;
    this.tx = 0;
    this.ty = 0;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
    }, { passive: true });
    window.addEventListener("pointermove", (e) => {
   updateCursorPosition(e.clientX, e.clientY);
});

    
    const magnets = document.querySelectorAll('[data-magnet]');
    magnets.forEach(el => {
      el.addEventListener('mouseenter', () => this.attract(el));
      el.addEventListener('mouseleave', () => this.release());
    });

    this.animate();
  }

  attract(el) {
    const rect = el.getBoundingClientRect();
    this.tx = rect.left + rect.width / 2;
    this.ty = rect.top + rect.height / 2;
  }

  release() {
    this.tx = this.x;
    this.ty = this.y;
  }

  animate() {
    const lerp = 0.18;
    this.tx += (this.x - this.tx) * lerp;
    this.ty += (this.y - this.ty) * lerp;

    if (this.cursor) {
      this.cursor.style.left = this.x + 'px';
      this.cursor.style.top = this.y + 'px';
    }

    if (this.follower) {
      this.follower.style.left = this.tx + 'px';
      this.follower.style.top = this.ty + 'px';
    }

    requestAnimationFrame(() => this.animate());
  }
}

// PRELOADER
class PreloaderManager {
  constructor() {
    this.preloader = document.getElementById('kinetic-preloader');
    if (!this.preloader) return;
    this.animate();
  }

  animate() {
    const progress = this.preloader.querySelector('.loader-progress');
    gsap.to(progress, {
      width: '100%',
      duration: 1.8,
      ease: 'power2.inOut',
      onComplete: () => this.hide()
    });
  }

  hide() {
    gsap.to(this.preloader, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        this.preloader.style.display = 'none';
        document.body.classList.remove('loading');
      }
    });
  }
}

// KPI COUNTER
class KPICounter {
  constructor() {
    const items = document.querySelectorAll('[data-target]');
    items.forEach(item => {
      const target = parseFloat(item.getAttribute('data-target'));
      const isDecimal = item.getAttribute('data-target').includes('.');

      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        delay: 0.8,
        ease: 'power3.out',
        onUpdate: function() {
          const value = isDecimal ? 
            this.targets()[0].val.toFixed(1) : 
            Math.floor(this.targets()[0].val);
          item.textContent = value;
        }
      });
    });
  }
}

// SCROLL ANIMATIONS
class ScrollAnimations {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    this.initParallaxGallery();
    this.initDockNavigation();
  }

  initParallaxGallery() {
    const images = document.querySelectorAll('.gallery-image');
    images.forEach(img => {
      const wrapper = img.closest('.gallery-image-wrapper');

      gsap.to(img, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top center',
          end: 'bottom center',
          scrub: 0.5
        }
      });
    });
  }

  initDockNavigation() {
    const dockItems = document.querySelectorAll('.dock-item');
    const sections = document.querySelectorAll('.kinetic-section');

    window.addEventListener('scroll', () => {
      let current = '';

      sections.forEach(section => {
        if (scrollY >= section.offsetTop - 250) {
          current = section.getAttribute('id');
        }
      });

      dockItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
          item.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); // optional
          item.classList.add('active');
        }
      });
    }, { passive: true });
  }
}

// SMOOTH SCROLLING
// SMOOTH SCROLLING (make Lenis global so we can stop/start during drags)
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 0.75,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1.15,
    smoothTouch: false,
    touchMultiplier: 1.8,
    infinite: false,
  });

  // Expose globally so other components can pause/resume during drag
  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}


// INFINITE TICKER
class InfiniteTicker {
  constructor() {
    const ticker = document.querySelector('.skills-ticker-track');
    if (!ticker) return;

    const items = ticker.querySelectorAll('span');
    if (items.length === 0) return;

    const firstItem = items[0];
    const clone = firstItem.cloneNode(true);
    ticker.appendChild(clone);

    const itemWidth = firstItem.offsetWidth;

    gsap.to(ticker, {
      x: -itemWidth,
      duration: 20,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % itemWidth)
      }
    });
  }
}

// HOVER EFFECTS
class HoverEffects {
  constructor() {
    const cards = document.querySelectorAll('.skill-category, .contact-item, .award-card, .exp-card, .education-item, .tech-tags li');
    cards.forEach(card => {
      if (card.tagName === 'LI') return;

      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, duration: 0.2, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.2, ease: 'power2.out' });
      });
    });
  }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new VisibleScrollBar();
  new MagneticCursor();
  new PreloaderManager();
  new KPICounter();
  new ScrollAnimations();
  new ExperienceScrollbar();
  new InfiniteTicker();
  new HoverEffects();

  initSmoothScroll();
  lucide.createIcons();

  // Smooth scroll for links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause();
  } else {
    gsap.globalTimeline.play();
  }
});
// Forward pointer position to any cursor code listening on 'mousemove'
function __forwardCursorMove(x, y) {
  try {
    const evt = new MouseEvent('mousemove', {
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: false,
      view: window
    });
    document.dispatchEvent(evt);
  } catch (_) { /* no-op */ }
}
