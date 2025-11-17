/* FINAL PERFORMANCE OPTIMIZED & POLISHED SCRIPT
   ==================================================================================
   V10.1 ("SNAPPY") - ANIMATION REFINEMENT
   - Updated easing across components to 'power3.out' for a snappier, more fluid feel.
   - ExperienceMasterDetail (Close): Reduced duration from 0.3s to 0.2s for faster dismissal.
   - ExperienceMasterDetail (Open): Reduced duration from 0.35s to 0.3s.
   - EducationCard: Reduced duration from 0.3s to 0.25s.
   - ProjectAccordion: Reduced duration from 0.4s to 0.3s.
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
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.updateDimensions(), 200);
    }, { passive: true });

    lenis.on('scroll', ({ scroll }) => {
       if (!this.isDragging) {
           const thumbPos = scroll / this.scrollRatio;
           if(isFinite(thumbPos)) {
               this.thumb.style.transform = `translate3d(0, ${thumbPos}px, 0)`;
           }
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
    if (isFinite(this.scrollRatio)) {
        const thumbPos = lenis.scroll / this.scrollRatio;
        this.thumb.style.transform = `translate3d(0, ${thumbPos}px, 0)`;
    }
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
    if(isFinite(this.scrollRatio)) {
        lenis.scrollTo(newThumbY * this.scrollRatio, { immediate: true });
    }
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
    if(isFinite(this.scrollRatio)) {
        lenis.scrollTo(Math.min(Math.max(0, thumbY), this.trackHeight - this.thumbHeight) * this.scrollRatio);
    }
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
    // *** FIX V9.2: Add check to prevent errors if elements aren't found
    if (!this.cursor || !this.follower) {
        console.warn('Magnetic cursor elements not found. Disabling feature.');
        return;
    }
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: this.pos.x, y: this.pos.y };
    this.speed = 0.4; // *** PERFORMANCE: Faster (was 0.6) ***
    this.activeMagnet = null;
    this.isActive = false;
    this.init();
  }

  init() {
    // *** FIX V9.2: If constructor returned early, don't init
    if (!this.cursor) return;
    
    window.addEventListener('pointermove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }, {passive: true});

    document.addEventListener('mouseleave', () => {
        this.cursor.style.opacity = '0';
        this.follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', (e) => {
        this.cursor.style.opacity = '1';
        this.follower.style.opacity = '0.5';
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    });

    // Initial listeners
    this.updateListeners();
  }
  
  // *** NEW: Method to re-apply listeners to new elements ***
  updateListeners() {
    // *** FIX V9.2: If constructor returned early, don't update
    if (!this.cursor) return;

    document.querySelectorAll('[data-magnet]').forEach(el => {
      el.removeEventListener('mouseenter', () => this.activateMagnet(el)); // Prevent duplicates
      el.removeEventListener('mouseleave', () => this.deactivateMagnet());
      el.addEventListener('mouseenter', () => this.activateMagnet(el));
      el.addEventListener('mouseleave', () => this.deactivateMagnet());
    });
     document.querySelectorAll('[data-magnet-small]').forEach(el => {
      el.removeEventListener('mouseenter', () => this.activateMagnet(el, true));
      el.removeEventListener('mouseleave', () => this.deactivateMagnet());
      el.addEventListener('mouseenter', () => this.activateMagnet(el, true));
      el.addEventListener('mouseleave', () => this.deactivateMagnet());
    });
  }

  activateMagnet(el, isSmall = false) {
    // *** FIX V9.2: If constructor returned early, do nothing
    if (!this.cursor) return;
    this.activeMagnet = el;
    this.cursor.classList.add('cursor-hover-magnet');
    this.follower.classList.add('follower-hover-magnet');
    if (isSmall) this.cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
  }

  deactivateMagnet() {
    // *** FIX V9.2: If constructor returned early, do nothing
    if (!this.cursor) return;
    this.activeMagnet = null;
    this.cursor.classList.remove('cursor-hover-magnet');
    this.follower.classList.remove('follower-hover-magnet');
    this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  }

  animate() {
    // *** FIX V9.2: If constructor returned early, do nothing
    if (!this.cursor) return;

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
    while (this.track.scrollWidth < window.innerWidth * 10) {
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
          const itemStyle = window.getComputedStyle(firstItem);
          const sepStyle = window.getComputedStyle(sep);
          this.itemWidth = firstItem.offsetWidth + sep.offsetWidth + 
                           parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight) +
                           parseFloat(sepStyle.marginLeft) + parseFloat(sepStyle.marginRight);
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

      if (Math.abs(this.dragVelocity) > 1 && this.itemWidth > 0) {
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
    if (trackWidth > 0) {
        if (this.offset <= -trackWidth) this.offset += trackWidth;
        else if (this.offset > 0) this.offset -= trackWidth;
    }
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
        this.updateListeners();
    }
    updateListeners() {
        // Query all interactive elements, including new ones
        document.querySelectorAll('a, button, .kpi-stat, .exp-card, .education-item, .tech-tags li, .skill-category, .skill-tag, .award-card, .contact-item, .scroll-top-btn, .read-more-btn, .skill-tag-mini, .interest-card').forEach(el => {
            el.removeEventListener('touchstart', this.onTouchStart);
            el.removeEventListener('touchend', this.onTouchEnd);
            el.addEventListener('touchstart', this.onTouchStart, {passive: true});
            el.addEventListener('touchend', this.onTouchEnd, {passive: true});
        });
    }
    onTouchStart() { this.classList.add('active-touch'); }
    onTouchEnd() { setTimeout(() => this.classList.remove('active-touch'), 150); }
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
          lenis.start();
      }
    });
  }
}
// Add Lenis stop on load
if (document.body.classList.contains('loading')) {
    lenis = new Lenis({
        duration: 1.0, // *** PERFORMANCE: Faster (was 1.2) ***
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: true, touchMultiplier: 1.5,
    });
    lenis.stop();
}

class TiltEffect {
  constructor() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => requestAnimationFrame(() => this.handleMove(e, card)));
      card.addEventListener('mouseleave', () => requestAnimationFrame(() => this.handleLeave(card)));
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
        if (e.target.closest('a, button')) return;
        this.isDown = true;
        this.container.classList.add('is-dragging');
        this.startX = e.pageX - this.container.offsetLeft;
        this.scrollLeft = this.container.scrollLeft;
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => 
          window.addEventListener(evt, () => {
              this.isDown = false;
              this.container.classList.remove('is-dragging');
          })
      );
      window.addEventListener('pointermove', (e) => {
        if (!this.isDown) return;
        e.preventDefault();
        this.container.scrollLeft = this.scrollLeft - (e.pageX - this.container.offsetLeft - this.startX) * 1.5;
      });
      this.container.addEventListener('scroll', () => requestAnimationFrame(() => this.updateThumb()), { passive: true });
      window.addEventListener('resize', () => this.updateThumb(), { passive: true });
      this.updateThumb();
  
      this.track.addEventListener('click', (e) => {
          if (e.target === this.thumb) return;
          const rect = this.track.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const thumbWidth = this.thumb.offsetWidth;
          const ratio = (clickX - thumbWidth / 2) / (this.track.clientWidth - thumbWidth);
          const scrollLeft = ratio * (this.container.scrollWidth - this.container.clientWidth);
          this.container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      });
    }
    updateThumb() {
      const scrollWidth = this.container.scrollWidth;
      const clientWidth = this.container.clientWidth;
      if (scrollWidth <= clientWidth) {
        this.track.style.display = 'none';
        return;
      }
      this.track.style.display = 'block';
      const maxScroll = scrollWidth - clientWidth;
      const thumbWidthPercent = (clientWidth / scrollWidth) * 100;
      const thumbWidthPx = this.track.clientWidth * (clientWidth / scrollWidth);
      const trackWidth = this.track.clientWidth;

      this.thumb.style.width = `${thumbWidthPercent}%`;
      const scrollPercent = this.container.scrollLeft / maxScroll;
      const thumbLeft = scrollPercent * (trackWidth - thumbWidthPx);
      this.thumb.style.left = `${thumbLeft}px`;
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

// ============================================================================
// *** FIX V9.3: REMOVED KINETIC TITLE CLASS ***
// ============================================================================
// class KineticTitle { ... }
// (Entire class removed as requested for a static, professional hero name)


// ============================================================================
// *** V10.1: SNAPPY EDUCATION CARD TOGGLE ***
// ============================================================================
class EducationCard {
  constructor() {
    this.cards = document.querySelectorAll('.education-item.interactive');
    this.init();
  }
  init() {
    this.cards.forEach(card => {
      // Find content and items once and store them
      const content = card.querySelector('.coursework-list');
      const listItems = card.querySelectorAll('.coursework-list li');
      if (!content) return;

      // Set initial state
      gsap.set(content, { maxHeight: 0, marginTop: 0 });
      gsap.set(listItems, { opacity: 0, y: 10 });

      // Store animation
      card.animation = null;

      card.addEventListener('click', () => {
        const isActive = card.classList.toggle('active');

        // Kill any ongoing animation on this card to prevent conflicts
        if (card.animation) {
          card.animation.kill();
        }

        // Animate *this* card
        if (isActive) {
          card.animation = gsap.timeline();
          card.animation.to(content, {
            maxHeight: 300, // Animate to max-height
            marginTop: 30,
            duration: 0.25, // *** V10.1: FASTER ***
            ease: 'power3.out', // *** V10.1: SNAPPIER ***
          })
          .fromTo(listItems, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.25, stagger: 0.05, ease: 'power3.out' }, // *** V10.1: FASTER/SNAPPIER ***
            "-=0.2" // Start this animation slightly before the parent finishes
          );
        } else {
          card.animation = gsap.timeline();
          card.animation.to(content, {
            maxHeight: 0,
            marginTop: 0,
            duration: 0.25, // *** V10.1: FASTER ***
            ease: 'power3.out', // *** V10.1: SNAPPIER ***
          });
          // Hide list items immediately on close
          gsap.set(listItems, { opacity: 0, y: 10 });
        }
        
        // Refresh Lenis after animation
        setTimeout(() => {
            ScrollTrigger.refresh();
            lenis.resize();
        }, 300); // Match animation duration
      });
    });
  }
}
// ============================================================================
// *** V10.1: SNAPPY PROJECT ACCORDION ***
// ============================================================================
class ProjectAccordion {
  constructor() {
    this.buttons = document.querySelectorAll('.read-more-btn');
    this.init();
  }
  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        if (!content) return;

        const isVisible = content.classList.toggle('visible');
        btn.classList.toggle('active', isVisible);
        btn.innerHTML = isVisible ? `Read Less <i data-lucide="chevron-up"></i>` : `Read More <i data-lucide="chevron-down"></i>`;
        
        lucide.createIcons();
        
        gsap.to(content, {
            height: isVisible ? 'auto' : 0,
            marginTop: isVisible ? 30 : 0,
            duration: 0.3, // *** V10.1: FASTER ***
            ease: 'power3.out', // *** V10.1: SNAPPIER ***
            onComplete: () => {
                ScrollTrigger.refresh();
                lenis.resize();
            }
        });
      });
    });
  }
}

// ============================================================================
// NEW: SKILL TAG FOCUS
// ============================================================================
class SkillTagFocus {
    constructor() {
        this.allTags = [];
        this.init();
    }
    init() {
        this.updateTagList();
        this.attachListeners();
    }
    updateTagList() {
        this.allTags = document.querySelectorAll('[data-skill]');
    }
    attachListeners() {
        this.allTags.forEach(tag => {
            tag.removeEventListener('mouseenter', this.onEnter.bind(this));
            tag.removeEventListener('mouseleave', this.onLeave.bind(this));
            tag.addEventListener('mouseenter', this.onEnter.bind(this));
            tag.addEventListener('mouseleave', this.onLeave.bind(this));
        });
    }
    onEnter(e) {
        const currentSkill = e.target.dataset.skill;
        if (!currentSkill) return;
        this.allTags.forEach(tag => {
            if (tag.dataset.skill !== currentSkill) {
                tag.classList.add('skill-tag-dimmed');
            }
        });
    }
    onLeave() {
        this.allTags.forEach(tag => {
            tag.classList.remove('skill-tag-dimmed');
        });
    }
}

// ============================================================================
// *** V10.1: SNAPPY EXPERIENCE MASTER-DETAIL ***
// ============================================================================
class ExperienceMasterDetail {
    constructor(skillFocusInstance, magneticCursor) { // *** NEW: Accept magneticCursor ***
        this.skillFocus = skillFocusInstance;
        this.magneticCursor = magneticCursor; // *** NEW: Save instance ***
        this.container = document.getElementById('experience-detail-container');
        this.cards = document.querySelectorAll('.exp-card[data-exp-id]');
        
        // === Data (unchanged) ===
        this.data = {
            cognizant: {
                title: 'Programmer Analyst',
                bullets: [
                    'Gained systems-level experience in how hardware integrates into larger enterprise stacks and how business requirements translate to technical specifications.',
                    'Automated key business workflows within the Intelligent Process Management team by <strong>developing and deploying solutions on the APPIAN low-code platform.</strong>',
                    'Collaborated on cross-functional projects to analyze and optimize enterprise-level processes, contributing to enhanced business efficiency.'
                ],
                skills: ['APPIAN', 'Process Management', 'Automation', 'Systems Integration']
            },
            insemi: {
                title: 'Design Verification Engineer',
                bullets: [
                    'Bridged the gap between academic understanding and industry practice, learning to optimize designs for manufacturability and meet strict timing/power budgets.',
                    'Developed a comprehensive <strong>UVM testbench</strong> to validate a Dual-Port RAM design.',
                    'Created constrained-random test cases that <strong>achieved 100% functional coverage.</strong>',
                    'Analyzed protocol compliance by writing <strong>SystemVerilog assertions</strong>, successfully identifying and debugging design flaws.'
                ],
                skills: ['UVM', 'SystemVerilog', 'Verification', 'Coverage', 'Timing Analysis']
            },
            maven: {
                title: 'Digital Design Intern',
                bullets: [
                    'Focused on a design-centric perspective, translating functional specifications into robust and efficient hardware implementations.',
                    'Deepened understanding of <strong>finite state machine (FSM)</strong> architecture and protocol design, including handshaking mechanisms and timing requirements.',
                    'Designed and implemented a compliant <strong>AMBA AHB-APB bridge in Verilog</strong> to manage communication between high- and low-frequency SoC subsystems.'
                ],
                skills: ['Verilog RTL', 'Digital Design', 'AMBA', 'SoC Design', 'FSM']
            },
            coreel: {
                title: 'Verification Intern',
                bullets: [
                    'Learned to <strong>think like a verification engineer</strong>, adopting a systematic and skeptical mindset to actively find design flaws.',
                    'Built key SystemVerilog testbench components (drivers, monitors, scoreboards) from scratch.',
                    'Developed and validated a SystemVerilog testbench for a full adder DUT, <strong>achieving 100% functional and code coverage</strong> through rigorous assertion-based verification.'
                ],
                skills: ['SystemVerilog', 'Verification', 'Coverage', 'Digital Design', 'Testbench']
            }
        };
        // === END DATA ===

        this.init();
    }

    init() {
        this.currentCard = null;
        this.startX = 0;
        this.isDragging = false;
        
        const onPointerMove = (e) => {
            if (!this.currentCard) return;
            if (Math.abs(e.clientX - this.startX) > 15) { // 15px threshold
                this.isDragging = true;
            }
        };

        const onPointerUp = (e) => { // *** NEW: Pass event 'e' ***
            // *** FIX: Mobile scroll-jacking bug ***
            // Check if the click *started* on an exp-card but *ended* on an education-item
            if (this.currentCard && e.target.closest('.education-item')) {
                this.currentCard = null;
                this.isDragging = false;
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                return; // Ignore this click
            }

            if (!this.currentCard) return; 
            const card = this.currentCard;
            
            if (this.isDragging) {
                // Was a drag
                this.currentCard = null;
                this.isDragging = false;
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                return;
            }

            // Was a click!
            const id = card.dataset.expId;
            if (!id) return;
            const wasActive = card.classList.contains('exp-active');
            
            this.cards.forEach(c => {
                if (c !== card) c.classList.remove('exp-active');
            });
            
            if (wasActive) {
                // Close the panel
                card.classList.remove('exp-active');
                this.closeDetailPanel(); // *** NEW: Use reusable function ***
            } else {
                // Open the panel
                this.updateDetail(id);
                card.classList.add('exp-active');
                lenis.scrollTo(this.container, { offset: -100, duration: 1.0, ease: 'power2.inOut' });
            }

            // Clean up
            this.currentCard = null;
            this.isDragging = false;
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        this.cards.forEach(card => {
            card.addEventListener('pointerdown', (e) => {
                // Prevent click if it's on a link or button inside the card (if any)
                if (e.target.closest('a, button')) return; 
                if (e.button !== 0) return;
                
                this.currentCard = card;
                this.startX = e.clientX;
                this.isDragging = false;
                window.addEventListener('pointermove', onPointerMove, { passive: true });
                window.addEventListener('pointerup', onPointerUp); // Removed passive to check target
            }, { passive: true });
        });
    }

    // *** V10.1: Reusable close function (FASTER) ***
    closeDetailPanel() {
        this.container.classList.remove('visible');
        gsap.to(this.container, { 
            height: 0, 
            duration: 0.2, // *** V10.1: FASTER ***
            ease: 'power3.out', // *** V10.1: SNAPPIER ***
            onComplete: this.onUpdateComplete.bind(this)
        });
    }

    updateDetail(id) {
        const item = this.data[id];
        if (!item) return;

        const skillsHTML = item.skills.map(skill => 
            `<li class="skill-tag-mini" data-skill="${skill}">${skill}</li>`
        ).join('');

        const bulletsHTML = item.bullets.map(bullet => 
            `<li>${bullet}</li>`
        ).join('');

        // *** FIX V9.1: Added tooltip span and data-magnet ***
        const newHTML = `
            <button type"button" class="back-to-cards-btn" data-magnet>
                <i data-lucide="arrow-up"></i>
                <span class="tooltip">Back to Cards</span>
            </button>
            <div class="experience-detail-content">
                <h4>${item.title}</h4>
                <ul>${bulletsHTML}</ul>
                <h5 class="skill-tags-mini-title">Relevant Skills</h5>
                <ul class="skill-tags-mini">${skillsHTML}</ul>
            </div>
        `;

        const isAlreadyVisible = this.container.classList.contains('visible');
        // Get current height before changing content if it was visible
        const currentHeight = isAlreadyVisible ? this.container.offsetHeight : 0;
        
        this.container.innerHTML = newHTML;
        
        // *** NEW: Add listener for the back button ***
        const backBtn = this.container.querySelector('.back-to-cards-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                // Find and remove active class from all cards
                this.cards.forEach(c => c.classList.remove('exp-active'));
                // Close the panel
                this.closeDetailPanel();
                // *** FIX V9.1: Scroll to card container, not section top ***
                lenis.scrollTo('#experienceContainer', { offset: -50, duration: 1.0, ease: 'power2.inOut' });
            });
        }
        
        // Animate height with GSAP
        gsap.set(this.container, { height: 'auto' }); // Get the auto height
        const autoHeight = this.container.offsetHeight; // Capture it
        
        gsap.fromTo(this.container, 
            { height: currentHeight }, // Start from current height (or 0)
            { 
                height: autoHeight, // Animate to auto height
                duration: 0.3, // *** V10.1: FASTER ***
                ease: 'power3.out', // *** V10.1: SNAPPIER ***
                onStart: () => {
                    this.container.classList.add('visible');
                },
                onComplete: () => {
                    this.onUpdateComplete();
                    // *** NEW: Update icons & magnetic listeners for new button ***
                    lucide.createIcons(); 
                    if (this.magneticCursor) {
                        this.magneticCursor.updateListeners();
                    }
                    // Set height to auto after animation to allow content changes
                    gsap.set(this.container, { height: 'auto' });
                }
            }
        );
    }

    onUpdateComplete() {
        ScrollTrigger.refresh();
        lenis.resize();
        if (this.skillFocus) {
            this.skillFocus.updateTagList();
            this.skillFocus.attachListeners();
        }
        new MobileTouchFix().updateListeners(); 
    }
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================
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

// *** FIX V9.2: Removed the DOMContentLoaded wrapper. ***
// The script is at the end of <body>, so the DOM is ready.
// This fixes the 'this.cursor' undefined race condition.

// *** FIX: Run Lucide first to fix missing icons ***
lucide.createIcons();

if (!lenis) {
    lenis = new Lenis({
        duration: 1.0, // *** PERFORMANCE: Faster (was 1.2) ***
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: true, touchMultiplier: 1.5,
    });
}

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

new ThemeManager(); 
new Preloader(); 
new VisibleScrollBar();
const magneticCursor = new MagneticCursor(); // *** NEW: Save instance ***
new SeamlessMarquee(); 
new ScrollReveals();
new ProjectObserver(); 
new ExperienceScroll();
new TiltEffect();
new ScrollTop(); 
initParallax(); 

// --- CLASS INITIALIZATIONS ---
// *** FIX V9.3: Removed 'new KineticTitle()' ***
const skillFocus = new SkillTagFocus();
// *** NEW: Pass magneticCursor instance ***
new ExperienceMasterDetail(skillFocus, magneticCursor); 
new EducationCard(); // This now contains the V10.1 fixes
new ProjectAccordion(); // This now contains the V10.1 fixes

new MobileTouchFix(); 

// Enhanced tool-tip dismissal
document.querySelectorAll('.dock-item').forEach(item => {
    const dismissTooltip = () => {
        item.classList.add('tooltip-dismissed');
        setTimeout(() => item.classList.remove('tooltip-dismissed'), 1500);
    };
    item.addEventListener('click', dismissTooltip);
    item.addEventListener('touchstart', dismissTooltip, {passive: true});
});

// KPI Counter
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

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) { 
      e.preventDefault(); 
      const targetHref = this.getAttribute('href');
      if (targetHref && targetHref !== '#') {
          lenis.scrollTo(targetHref);
      }
  });
});