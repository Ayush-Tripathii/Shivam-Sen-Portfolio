/**
 * Shivam Sen Portfolio — main.js
 * Comprehensive Engine: Loader, Cursor, Navigation, Scroll Reveals,
 *                      Dynamic Galleries (All Categories), Cinema Video Player,
 *                      and Category Filter Tabs.
 */

(function () {
  'use strict';

  // =========================================================
  // 1. LOADER
  // =========================================================
  const loader = document.getElementById('loader');

  function hideLoader() {
    if (!loader) return;
    loader.classList.add('is-hidden');
    document.body.style.overflow = '';
    setTimeout(() => {
      const hero = document.querySelector('.hero');
      if (hero) hero.classList.add('is-revealed');
      const heroVideo = document.querySelector('.hero__video');
      if (heroVideo && heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
    }, 200);
  }

  function initLoader() {
    if (!loader) return;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      loader.classList.add('is-active');
    });

    const hideTimer = setTimeout(hideLoader, 2200);
    window.addEventListener('load', () => {
      clearTimeout(hideTimer);
      setTimeout(hideLoader, 400);
    }, { once: true });
  }

  initLoader();

  // =========================================================
  // 2. ULTRA-SMOOTH CUSTOM CURSOR (120fps, zero lag, auto rAF sleep)
  // =========================================================
  const cursor = document.getElementById('cursor');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (cursor && !isTouchDevice) {
    const cursorDot = cursor.querySelector('.cursor__dot');
    const cursorRing = cursor.querySelector('.cursor__ring');
    const cursorLabel = cursor.querySelector('.cursor__label');

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isMoving = false;
    let rafId = null;

    function renderCursor() {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.18;
      ringY += dy * 0.18;

      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      cursorLabel.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05 || isMoving) {
        rafId = requestAnimationFrame(renderCursor);
      } else {
        rafId = null;
      }
    }

    let moveTimeout;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => { isMoving = false; }, 60);

      if (!rafId) {
        rafId = requestAnimationFrame(renderCursor);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });

    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        cursorLabel.textContent = el.dataset.cursor;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        cursorLabel.textContent = '';
      });
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  // =========================================================
  // 3. UNIFIED HIGH-PERFORMANCE SCROLL ENGINE
  // =========================================================
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const heroImg = document.querySelector('.hero__image-wrap');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ticking = false;
  function onScrollTick() {
    const scrollY = window.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', scrollY > 60);
    }
    if (heroImg && !isTouchDevice && !prefersReducedMotion) {
      const max = window.innerHeight;
      if (scrollY <= max) {
        heroImg.style.transform = `scale(1.03) translate3d(0, ${(scrollY / max) * 35}px, 0)`;
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScrollTick);
      ticking = true;
    }
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen.toString());
      navLinks.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // =========================================================
  // 4. SCROLL REVEAL OBSERVER
  // =========================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-text, .reveal-lines').forEach(el => {
    revealObserver.observe(el);
  });

  const imgRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = (i % 4) * 70;
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, delay);
        imgRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.img-reveal').forEach(el => {
    imgRevealObserver.observe(el);
  });

  // =========================================================
  // 5. COMPREHENSIVE CATEGORY GALLERIES
  // =========================================================
  const galleries = {
  "childhood": [
    {
      "src": "assets/images/baby-shoot/baby-01-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-01-md.webp",
      "alt": "Childhood Series — Photograph 1"
    },
    {
      "src": "assets/images/baby-shoot/baby-02-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-02-md.webp",
      "alt": "Childhood Series — Photograph 2"
    },
    {
      "src": "assets/images/baby-shoot/baby-03-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-03-md.webp",
      "alt": "Childhood Series — Photograph 3"
    },
    {
      "src": "assets/images/baby-shoot/baby-04-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-04-md.webp",
      "alt": "Childhood Series — Photograph 4"
    },
    {
      "src": "assets/images/baby-shoot/baby-05-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-05-md.webp",
      "alt": "Childhood Series — Photograph 5"
    },
    {
      "src": "assets/images/baby-shoot/baby-06-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-06-md.webp",
      "alt": "Childhood Series — Photograph 6"
    },
    {
      "src": "assets/images/baby-shoot/baby-07-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-07-md.webp",
      "alt": "Childhood Series — Photograph 7"
    },
    {
      "src": "assets/images/baby-shoot/baby-08-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-08-md.webp",
      "alt": "Childhood Series — Photograph 8"
    },
    {
      "src": "assets/images/baby-shoot/baby-09-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-09-md.webp",
      "alt": "Childhood Series — Photograph 9"
    },
    {
      "src": "assets/images/baby-shoot/baby-10-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-10-md.webp",
      "alt": "Childhood Series — Photograph 10"
    },
    {
      "src": "assets/images/baby-shoot/baby-11-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-11-md.webp",
      "alt": "Childhood Series — Photograph 11"
    },
    {
      "src": "assets/images/baby-shoot/baby-12-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-12-md.webp",
      "alt": "Childhood Series — Photograph 12"
    },
    {
      "src": "assets/images/baby-shoot/baby-13-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-13-md.webp",
      "alt": "Childhood Series — Photograph 13"
    },
    {
      "src": "assets/images/baby-shoot/baby-14-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-14-md.webp",
      "alt": "Childhood Series — Photograph 14"
    },
    {
      "src": "assets/images/baby-shoot/baby-15-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-15-md.webp",
      "alt": "Childhood Series — Photograph 15"
    },
    {
      "src": "assets/images/baby-shoot/baby-16-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-16-md.webp",
      "alt": "Childhood Series — Photograph 16"
    },
    {
      "src": "assets/images/baby-shoot/baby-17-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-17-md.webp",
      "alt": "Childhood Series — Photograph 17"
    },
    {
      "src": "assets/images/baby-shoot/baby-18-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-18-md.webp",
      "alt": "Childhood Series — Photograph 18"
    },
    {
      "src": "assets/images/baby-shoot/baby-19-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-19-md.webp",
      "alt": "Childhood Series — Photograph 19"
    },
    {
      "src": "assets/images/baby-shoot/baby-20-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-20-md.webp",
      "alt": "Childhood Series — Photograph 20"
    },
    {
      "src": "assets/images/baby-shoot/baby-21-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-21-md.webp",
      "alt": "Childhood Series — Photograph 21"
    },
    {
      "src": "assets/images/baby-shoot/baby-22-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-22-md.webp",
      "alt": "Childhood Series — Photograph 22"
    },
    {
      "src": "assets/images/baby-shoot/baby-23-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-23-md.webp",
      "alt": "Childhood Series — Photograph 23"
    },
    {
      "src": "assets/images/baby-shoot/baby-24-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-24-md.webp",
      "alt": "Childhood Series — Photograph 24"
    },
    {
      "src": "assets/images/baby-shoot/baby-25-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-25-md.webp",
      "alt": "Childhood Series — Photograph 25"
    },
    {
      "src": "assets/images/baby-shoot/baby-26-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-26-md.webp",
      "alt": "Childhood Series — Photograph 26"
    },
    {
      "src": "assets/images/baby-shoot/baby-27-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-27-md.webp",
      "alt": "Childhood Series — Photograph 27"
    },
    {
      "src": "assets/images/baby-shoot/baby-28-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-28-md.webp",
      "alt": "Childhood Series — Photograph 28"
    },
    {
      "src": "assets/images/baby-shoot/baby-29-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-29-md.webp",
      "alt": "Childhood Series — Photograph 29"
    },
    {
      "src": "assets/images/baby-shoot/baby-30-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-30-md.webp",
      "alt": "Childhood Series — Photograph 30"
    },
    {
      "src": "assets/images/baby-shoot/baby-31-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-31-md.webp",
      "alt": "Childhood Series — Photograph 31"
    },
    {
      "src": "assets/images/baby-shoot/baby-32-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-32-md.webp",
      "alt": "Childhood Series — Photograph 32"
    },
    {
      "src": "assets/images/baby-shoot/baby-33-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-33-md.webp",
      "alt": "Childhood Series — Photograph 33"
    },
    {
      "src": "assets/images/baby-shoot/baby-34-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-34-md.webp",
      "alt": "Childhood Series — Photograph 34"
    },
    {
      "src": "assets/images/baby-shoot/baby-35-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-35-md.webp",
      "alt": "Childhood Series — Photograph 35"
    },
    {
      "src": "assets/images/baby-shoot/baby-36-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-36-md.webp",
      "alt": "Childhood Series — Photograph 36"
    },
    {
      "src": "assets/images/baby-shoot/baby-37-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-37-md.webp",
      "alt": "Childhood Series — Photograph 37"
    },
    {
      "src": "assets/images/baby-shoot/baby-38-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-38-md.webp",
      "alt": "Childhood Series — Photograph 38"
    },
    {
      "src": "assets/images/baby-shoot/baby-39-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-39-md.webp",
      "alt": "Childhood Series — Photograph 39"
    },
    {
      "src": "assets/images/baby-shoot/baby-40-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-40-md.webp",
      "alt": "Childhood Series — Photograph 40"
    },
    {
      "src": "assets/images/baby-shoot/baby-41-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-41-md.webp",
      "alt": "Childhood Series — Photograph 41"
    },
    {
      "src": "assets/images/baby-shoot/baby-42-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-42-md.webp",
      "alt": "Childhood Series — Photograph 42"
    },
    {
      "src": "assets/images/baby-shoot/baby-43-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-43-md.webp",
      "alt": "Childhood Series — Photograph 43"
    },
    {
      "src": "assets/images/baby-shoot/baby-44-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-44-md.webp",
      "alt": "Childhood Series — Photograph 44"
    },
    {
      "src": "assets/images/baby-shoot/baby-45-lg.webp",
      "thumb": "assets/images/baby-shoot/baby-45-md.webp",
      "alt": "Childhood Series — Photograph 45"
    }
  ],
  "celebrations": [
    {
      "src": "assets/images/birthday/bday-01-lg.webp",
      "thumb": "assets/images/birthday/bday-01-md.webp",
      "alt": "Celebrations & Birthday — Photograph 1"
    },
    {
      "src": "assets/images/birthday/bday-02-lg.webp",
      "thumb": "assets/images/birthday/bday-02-md.webp",
      "alt": "Celebrations & Birthday — Photograph 2"
    },
    {
      "src": "assets/images/birthday/bday-03-lg.webp",
      "thumb": "assets/images/birthday/bday-03-md.webp",
      "alt": "Celebrations & Birthday — Photograph 3"
    },
    {
      "src": "assets/images/birthday/bday-04-lg.webp",
      "thumb": "assets/images/birthday/bday-04-md.webp",
      "alt": "Celebrations & Birthday — Photograph 4"
    },
    {
      "src": "assets/images/birthday/bday-05-lg.webp",
      "thumb": "assets/images/birthday/bday-05-md.webp",
      "alt": "Celebrations & Birthday — Photograph 5"
    },
    {
      "src": "assets/images/birthday/bday-06-lg.webp",
      "thumb": "assets/images/birthday/bday-06-md.webp",
      "alt": "Celebrations & Birthday — Photograph 6"
    },
    {
      "src": "assets/images/birthday/bday-07-lg.webp",
      "thumb": "assets/images/birthday/bday-07-md.webp",
      "alt": "Celebrations & Birthday — Photograph 7"
    },
    {
      "src": "assets/images/birthday/bday-08-lg.webp",
      "thumb": "assets/images/birthday/bday-08-md.webp",
      "alt": "Celebrations & Birthday — Photograph 8"
    },
    {
      "src": "assets/images/birthday/bday-09-lg.webp",
      "thumb": "assets/images/birthday/bday-09-md.webp",
      "alt": "Celebrations & Birthday — Photograph 9"
    },
    {
      "src": "assets/images/birthday/bday-10-lg.webp",
      "thumb": "assets/images/birthday/bday-10-md.webp",
      "alt": "Celebrations & Birthday — Photograph 10"
    },
    {
      "src": "assets/images/birthday/bday-11-lg.webp",
      "thumb": "assets/images/birthday/bday-11-md.webp",
      "alt": "Celebrations & Birthday — Photograph 11"
    },
    {
      "src": "assets/images/birthday/bday-12-lg.webp",
      "thumb": "assets/images/birthday/bday-12-md.webp",
      "alt": "Celebrations & Birthday — Photograph 12"
    },
    {
      "src": "assets/images/birthday/bday-13-lg.webp",
      "thumb": "assets/images/birthday/bday-13-md.webp",
      "alt": "Celebrations & Birthday — Photograph 13"
    },
    {
      "src": "assets/images/birthday/bday-14-lg.webp",
      "thumb": "assets/images/birthday/bday-14-md.webp",
      "alt": "Celebrations & Birthday — Photograph 14"
    },
    {
      "src": "assets/images/birthday/bday-15-lg.webp",
      "thumb": "assets/images/birthday/bday-15-md.webp",
      "alt": "Celebrations & Birthday — Photograph 15"
    },
    {
      "src": "assets/images/birthday/bday-16-lg.webp",
      "thumb": "assets/images/birthday/bday-16-md.webp",
      "alt": "Celebrations & Birthday — Photograph 16"
    },
    {
      "src": "assets/images/birthday/bday-17-lg.webp",
      "thumb": "assets/images/birthday/bday-17-md.webp",
      "alt": "Celebrations & Birthday — Photograph 17"
    },
    {
      "src": "assets/images/birthday/bday-18-lg.webp",
      "thumb": "assets/images/birthday/bday-18-md.webp",
      "alt": "Celebrations & Birthday — Photograph 18"
    },
    {
      "src": "assets/images/birthday/bday-19-lg.webp",
      "thumb": "assets/images/birthday/bday-19-md.webp",
      "alt": "Celebrations & Birthday — Photograph 19"
    },
    {
      "src": "assets/images/birthday/bday-20-lg.webp",
      "thumb": "assets/images/birthday/bday-20-md.webp",
      "alt": "Celebrations & Birthday — Photograph 20"
    },
    {
      "src": "assets/images/birthday/bday-21-lg.webp",
      "thumb": "assets/images/birthday/bday-21-md.webp",
      "alt": "Celebrations & Birthday — Photograph 21"
    },
    {
      "src": "assets/images/birthday/bday-22-lg.webp",
      "thumb": "assets/images/birthday/bday-22-md.webp",
      "alt": "Celebrations & Birthday — Photograph 22"
    },
    {
      "src": "assets/images/birthday/bday-23-lg.webp",
      "thumb": "assets/images/birthday/bday-23-md.webp",
      "alt": "Celebrations & Birthday — Photograph 23"
    },
    {
      "src": "assets/images/birthday/bday-24-lg.webp",
      "thumb": "assets/images/birthday/bday-24-md.webp",
      "alt": "Celebrations & Birthday — Photograph 24"
    },
    {
      "src": "assets/images/birthday/bday-25-lg.webp",
      "thumb": "assets/images/birthday/bday-25-md.webp",
      "alt": "Celebrations & Birthday — Photograph 25"
    },
    {
      "src": "assets/images/birthday/bday-26-lg.webp",
      "thumb": "assets/images/birthday/bday-26-md.webp",
      "alt": "Celebrations & Birthday — Photograph 26"
    },
    {
      "src": "assets/images/birthday/bday-27-lg.webp",
      "thumb": "assets/images/birthday/bday-27-md.webp",
      "alt": "Celebrations & Birthday — Photograph 27"
    },
    {
      "src": "assets/images/birthday/bday-28-lg.webp",
      "thumb": "assets/images/birthday/bday-28-md.webp",
      "alt": "Celebrations & Birthday — Photograph 28"
    },
    {
      "src": "assets/images/birthday/bday-29-lg.webp",
      "thumb": "assets/images/birthday/bday-29-md.webp",
      "alt": "Celebrations & Birthday — Photograph 29"
    },
    {
      "src": "assets/images/birthday/bday-30-lg.webp",
      "thumb": "assets/images/birthday/bday-30-md.webp",
      "alt": "Celebrations & Birthday — Photograph 30"
    },
    {
      "src": "assets/images/birthday/bday-31-lg.webp",
      "thumb": "assets/images/birthday/bday-31-md.webp",
      "alt": "Celebrations & Birthday — Photograph 31"
    },
    {
      "src": "assets/images/birthday/bday-32-lg.webp",
      "thumb": "assets/images/birthday/bday-32-md.webp",
      "alt": "Celebrations & Birthday — Photograph 32"
    },
    {
      "src": "assets/images/birthday/bday-33-lg.webp",
      "thumb": "assets/images/birthday/bday-33-md.webp",
      "alt": "Celebrations & Birthday — Photograph 33"
    },
    {
      "src": "assets/images/birthday/bday-34-lg.webp",
      "thumb": "assets/images/birthday/bday-34-md.webp",
      "alt": "Celebrations & Birthday — Photograph 34"
    },
    {
      "src": "assets/images/birthday/bday-35-lg.webp",
      "thumb": "assets/images/birthday/bday-35-md.webp",
      "alt": "Celebrations & Birthday — Photograph 35"
    },
    {
      "src": "assets/images/birthday/bday-36-lg.webp",
      "thumb": "assets/images/birthday/bday-36-md.webp",
      "alt": "Celebrations & Birthday — Photograph 36"
    },
    {
      "src": "assets/images/birthday/bday-37-lg.webp",
      "thumb": "assets/images/birthday/bday-37-md.webp",
      "alt": "Celebrations & Birthday — Photograph 37"
    },
    {
      "src": "assets/images/birthday/bday-38-lg.webp",
      "thumb": "assets/images/birthday/bday-38-md.webp",
      "alt": "Celebrations & Birthday — Photograph 38"
    },
    {
      "src": "assets/images/birthday/bday-39-lg.webp",
      "thumb": "assets/images/birthday/bday-39-md.webp",
      "alt": "Celebrations & Birthday — Photograph 39"
    },
    {
      "src": "assets/images/birthday/bday-40-lg.webp",
      "thumb": "assets/images/birthday/bday-40-md.webp",
      "alt": "Celebrations & Birthday — Photograph 40"
    },
    {
      "src": "assets/images/birthday/bday-41-lg.webp",
      "thumb": "assets/images/birthday/bday-41-md.webp",
      "alt": "Celebrations & Birthday — Photograph 41"
    },
    {
      "src": "assets/images/birthday/bday-42-lg.webp",
      "thumb": "assets/images/birthday/bday-42-md.webp",
      "alt": "Celebrations & Birthday — Photograph 42"
    },
    {
      "src": "assets/images/birthday/bday-43-lg.webp",
      "thumb": "assets/images/birthday/bday-43-md.webp",
      "alt": "Celebrations & Birthday — Photograph 43"
    },
    {
      "src": "assets/images/birthday/bday-44-lg.webp",
      "thumb": "assets/images/birthday/bday-44-md.webp",
      "alt": "Celebrations & Birthday — Photograph 44"
    },
    {
      "src": "assets/images/birthday/bday-45-lg.webp",
      "thumb": "assets/images/birthday/bday-45-md.webp",
      "alt": "Celebrations & Birthday — Photograph 45"
    },
    {
      "src": "assets/images/birthday/bday-46-lg.webp",
      "thumb": "assets/images/birthday/bday-46-md.webp",
      "alt": "Celebrations & Birthday — Photograph 46"
    },
    {
      "src": "assets/images/birthday/bday-47-lg.webp",
      "thumb": "assets/images/birthday/bday-47-md.webp",
      "alt": "Celebrations & Birthday — Photograph 47"
    },
    {
      "src": "assets/images/birthday/bday-48-lg.webp",
      "thumb": "assets/images/birthday/bday-48-md.webp",
      "alt": "Celebrations & Birthday — Photograph 48"
    },
    {
      "src": "assets/images/birthday/bday-49-lg.webp",
      "thumb": "assets/images/birthday/bday-49-md.webp",
      "alt": "Celebrations & Birthday — Photograph 49"
    },
    {
      "src": "assets/images/birthday/bday-50-lg.webp",
      "thumb": "assets/images/birthday/bday-50-md.webp",
      "alt": "Celebrations & Birthday — Photograph 50"
    },
    {
      "src": "assets/images/birthday/bday-51-lg.webp",
      "thumb": "assets/images/birthday/bday-51-md.webp",
      "alt": "Celebrations & Birthday — Photograph 51"
    },
    {
      "src": "assets/images/birthday/bday-52-lg.webp",
      "thumb": "assets/images/birthday/bday-52-md.webp",
      "alt": "Celebrations & Birthday — Photograph 52"
    },
    {
      "src": "assets/images/birthday/bday-53-lg.webp",
      "thumb": "assets/images/birthday/bday-53-md.webp",
      "alt": "Celebrations & Birthday — Photograph 53"
    },
    {
      "src": "assets/images/birthday/bday-54-lg.webp",
      "thumb": "assets/images/birthday/bday-54-md.webp",
      "alt": "Celebrations & Birthday — Photograph 54"
    },
    {
      "src": "assets/images/birthday/bday-55-lg.webp",
      "thumb": "assets/images/birthday/bday-55-md.webp",
      "alt": "Celebrations & Birthday — Photograph 55"
    },
    {
      "src": "assets/images/birthday/bday-56-lg.webp",
      "thumb": "assets/images/birthday/bday-56-md.webp",
      "alt": "Celebrations & Birthday — Photograph 56"
    },
    {
      "src": "assets/images/birthday/bday-57-lg.webp",
      "thumb": "assets/images/birthday/bday-57-md.webp",
      "alt": "Celebrations & Birthday — Photograph 57"
    },
    {
      "src": "assets/images/birthday/bday-58-lg.webp",
      "thumb": "assets/images/birthday/bday-58-md.webp",
      "alt": "Celebrations & Birthday — Photograph 58"
    },
    {
      "src": "assets/images/birthday/bday-59-lg.webp",
      "thumb": "assets/images/birthday/bday-59-md.webp",
      "alt": "Celebrations & Birthday — Photograph 59"
    },
    {
      "src": "assets/images/birthday/bday-60-lg.webp",
      "thumb": "assets/images/birthday/bday-60-md.webp",
      "alt": "Celebrations & Birthday — Photograph 60"
    },
    {
      "src": "assets/images/birthday/bday-61-lg.webp",
      "thumb": "assets/images/birthday/bday-61-md.webp",
      "alt": "Celebrations & Birthday — Photograph 61"
    },
    {
      "src": "assets/images/birthday/bday-62-lg.webp",
      "thumb": "assets/images/birthday/bday-62-md.webp",
      "alt": "Celebrations & Birthday — Photograph 62"
    },
    {
      "src": "assets/images/birthday/bday-63-lg.webp",
      "thumb": "assets/images/birthday/bday-63-md.webp",
      "alt": "Celebrations & Birthday — Photograph 63"
    },
    {
      "src": "assets/images/birthday/bday-64-lg.webp",
      "thumb": "assets/images/birthday/bday-64-md.webp",
      "alt": "Celebrations & Birthday — Photograph 64"
    },
    {
      "src": "assets/images/birthday/bday-65-lg.webp",
      "thumb": "assets/images/birthday/bday-65-md.webp",
      "alt": "Celebrations & Birthday — Photograph 65"
    },
    {
      "src": "assets/images/birthday/bday-66-lg.webp",
      "thumb": "assets/images/birthday/bday-66-md.webp",
      "alt": "Celebrations & Birthday — Photograph 66"
    },
    {
      "src": "assets/images/birthday/bday-67-lg.webp",
      "thumb": "assets/images/birthday/bday-67-md.webp",
      "alt": "Celebrations & Birthday — Photograph 67"
    },
    {
      "src": "assets/images/birthday/bday-68-lg.webp",
      "thumb": "assets/images/birthday/bday-68-md.webp",
      "alt": "Celebrations & Birthday — Photograph 68"
    },
    {
      "src": "assets/images/birthday/bday-69-lg.webp",
      "thumb": "assets/images/birthday/bday-69-md.webp",
      "alt": "Celebrations & Birthday — Photograph 69"
    },
    {
      "src": "assets/images/birthday/bday-70-lg.webp",
      "thumb": "assets/images/birthday/bday-70-md.webp",
      "alt": "Celebrations & Birthday — Photograph 70"
    },
    {
      "src": "assets/images/birthday/bday-71-lg.webp",
      "thumb": "assets/images/birthday/bday-71-md.webp",
      "alt": "Celebrations & Birthday — Photograph 71"
    },
    {
      "src": "assets/images/birthday/bday-72-lg.webp",
      "thumb": "assets/images/birthday/bday-72-md.webp",
      "alt": "Celebrations & Birthday — Photograph 72"
    },
    {
      "src": "assets/images/birthday/bday-73-lg.webp",
      "thumb": "assets/images/birthday/bday-73-md.webp",
      "alt": "Celebrations & Birthday — Photograph 73"
    }
  ],
  "product": [
    {
      "src": "assets/images/product/prod-01-lg.webp",
      "thumb": "assets/images/product/prod-01-md.webp",
      "alt": "Product & Commercial — Photograph 1"
    },
    {
      "src": "assets/images/product/prod-02-lg.webp",
      "thumb": "assets/images/product/prod-02-md.webp",
      "alt": "Product & Commercial — Photograph 2"
    },
    {
      "src": "assets/images/product/prod-03-lg.webp",
      "thumb": "assets/images/product/prod-03-md.webp",
      "alt": "Product & Commercial — Photograph 3"
    },
    {
      "src": "assets/images/product/prod-04-lg.webp",
      "thumb": "assets/images/product/prod-04-md.webp",
      "alt": "Product & Commercial — Photograph 4"
    },
    {
      "src": "assets/images/product/prod-05-lg.webp",
      "thumb": "assets/images/product/prod-05-md.webp",
      "alt": "Product & Commercial — Photograph 5"
    },
    {
      "src": "assets/images/product/prod-06-lg.webp",
      "thumb": "assets/images/product/prod-06-md.webp",
      "alt": "Product & Commercial — Photograph 6"
    },
    {
      "src": "assets/images/product/prod-07-lg.webp",
      "thumb": "assets/images/product/prod-07-md.webp",
      "alt": "Product & Commercial — Photograph 7"
    },
    {
      "src": "assets/images/product/prod-08-lg.webp",
      "thumb": "assets/images/product/prod-08-md.webp",
      "alt": "Product & Commercial — Photograph 8"
    },
    {
      "src": "assets/images/product/prod-09-lg.webp",
      "thumb": "assets/images/product/prod-09-md.webp",
      "alt": "Product & Commercial — Photograph 9"
    },
    {
      "src": "assets/images/product/prod-10-lg.webp",
      "thumb": "assets/images/product/prod-10-md.webp",
      "alt": "Product & Commercial — Photograph 10"
    },
    {
      "src": "assets/images/product/prod-11-lg.webp",
      "thumb": "assets/images/product/prod-11-md.webp",
      "alt": "Product & Commercial — Photograph 11"
    },
    {
      "src": "assets/images/product/prod-12-lg.webp",
      "thumb": "assets/images/product/prod-12-md.webp",
      "alt": "Product & Commercial — Photograph 12"
    },
    {
      "src": "assets/images/product/prod-13-lg.webp",
      "thumb": "assets/images/product/prod-13-md.webp",
      "alt": "Product & Commercial — Photograph 13"
    },
    {
      "src": "assets/images/product/prod-14-lg.webp",
      "thumb": "assets/images/product/prod-14-md.webp",
      "alt": "Product & Commercial — Photograph 14"
    },
    {
      "src": "assets/images/product/prod-15-lg.webp",
      "thumb": "assets/images/product/prod-15-md.webp",
      "alt": "Product & Commercial — Photograph 15"
    },
    {
      "src": "assets/images/product/prod-16-lg.webp",
      "thumb": "assets/images/product/prod-16-md.webp",
      "alt": "Product & Commercial — Photograph 16"
    }
  ],
  "bts": [
    {
      "src": "assets/images/bts/bts-01-lg.webp",
      "thumb": "assets/images/bts/bts-01-md.webp",
      "alt": "Behind the Scenes & Production — Frame 1"
    },
    {
      "src": "assets/images/bts/bts-02-lg.webp",
      "thumb": "assets/images/bts/bts-02-md.webp",
      "alt": "Behind the Scenes & Production — Frame 2"
    },
    {
      "src": "assets/images/bts/bts-03-lg.webp",
      "thumb": "assets/images/bts/bts-03-md.webp",
      "alt": "Behind the Scenes & Production — Frame 3"
    },
    {
      "src": "assets/images/bts/bts-04-lg.webp",
      "thumb": "assets/images/bts/bts-04-md.webp",
      "alt": "Behind the Scenes & Production — Frame 4"
    },
    {
      "src": "assets/images/bts/bts-05-lg.webp",
      "thumb": "assets/images/bts/bts-05-md.webp",
      "alt": "Behind the Scenes & Production — Frame 5"
    },
    {
      "src": "assets/images/bts/bts-06-lg.webp",
      "thumb": "assets/images/bts/bts-06-md.webp",
      "alt": "Behind the Scenes & Production — Frame 6"
    },
    {
      "src": "assets/images/bts/bts-07-lg.webp",
      "thumb": "assets/images/bts/bts-07-md.webp",
      "alt": "Behind the Scenes & Production — Frame 7"
    },
    {
      "src": "assets/images/bts/bts-08-lg.webp",
      "thumb": "assets/images/bts/bts-08-md.webp",
      "alt": "Behind the Scenes & Production — Frame 8"
    },
    {
      "src": "assets/images/bts/bts-09-lg.webp",
      "thumb": "assets/images/bts/bts-09-md.webp",
      "alt": "Behind the Scenes & Production — Frame 9"
    },
    {
      "src": "assets/images/bts/bts-10-lg.webp",
      "thumb": "assets/images/bts/bts-10-md.webp",
      "alt": "Behind the Scenes & Production — Frame 10"
    },
    {
      "src": "assets/images/bts/bts-11-lg.webp",
      "thumb": "assets/images/bts/bts-11-md.webp",
      "alt": "Behind the Scenes & Production — Frame 11"
    },
    {
      "src": "assets/images/bts/bts-12-lg.webp",
      "thumb": "assets/images/bts/bts-12-md.webp",
      "alt": "Behind the Scenes & Production — Frame 12"
    },
    {
      "src": "assets/images/bts/bts-13-lg.webp",
      "thumb": "assets/images/bts/bts-13-md.webp",
      "alt": "Behind the Scenes & Production — Frame 13"
    },
    {
      "src": "assets/images/bts/bts-14-lg.webp",
      "thumb": "assets/images/bts/bts-14-md.webp",
      "alt": "Behind the Scenes & Production — Frame 14"
    },
    {
      "src": "assets/images/bts/bts-15-lg.webp",
      "thumb": "assets/images/bts/bts-15-md.webp",
      "alt": "Behind the Scenes & Production — Frame 15"
    },
    {
      "src": "assets/images/bts/bts-16-lg.webp",
      "thumb": "assets/images/bts/bts-16-md.webp",
      "alt": "Behind the Scenes & Production — Frame 16"
    },
    {
      "src": "assets/images/bts/bts-17-lg.webp",
      "thumb": "assets/images/bts/bts-17-md.webp",
      "alt": "Behind the Scenes & Production — Frame 17"
    }
  ],
  "documentary": [
    {
      "src": "assets/images/documentary-webp/doc-01-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-01-md.webp",
      "alt": "Street Photography — Spices vendor in the marketplace. Canon EOS 200D · 109mm · ISO 200 · f/5 · 1/200s"
    },
    {
      "src": "assets/images/documentary-webp/doc-02-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-02-md.webp",
      "alt": "Night Photography — Quiet boat reflected on still waters. Canon EOS 200D · 28mm · ISO 800 · f/7.1 · 1/4s"
    },
    {
      "src": "assets/images/documentary-webp/doc-03-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-03-md.webp",
      "alt": "Candid Photography — A spontaneous, joyful moment with a sadhu monk. Canon EOS 200D · 55mm · ISO 200 · f/4.5 · 1/125s"
    },
    {
      "src": "assets/images/documentary-webp/doc-04-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-04-md.webp",
      "alt": "Skyscape Photography — Golden hour sunburst over the lake. Canon EOS 200D · 18mm · ISO 200 · f/16 · 1/125s"
    },
    {
      "src": "assets/images/documentary-webp/doc-05-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-05-md.webp",
      "alt": "Nature Photography — Monarch butterfly in natural habitat. Canon EOS 200D · 24mm · ISO 200 · f/5 · 1/200s"
    },
    {
      "src": "assets/images/documentary-webp/doc-06-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-06-md.webp",
      "alt": "Panorama Photography — Panoramic vista across Bhopal Upper Lake. Canon EOS 200D · 55mm · ISO 100 · f/7.1 · 1/125s"
    },
    {
      "src": "assets/images/documentary-webp/doc-07-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-07-md.webp",
      "alt": "Still Life Photography — Desk flatlay — 'You Can' journal & workspace. Sony Alpha 7 M3 · 37mm · ISO 250 · f/11 · 1/30s"
    },
    {
      "src": "assets/images/documentary-webp/doc-08-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-08-md.webp",
      "alt": "Silhouette Photography — Human silhouette suspended against cloudscape. Canon EOS 200D · 18mm · ISO 200 · f/9 · 1/250s"
    },
    {
      "src": "assets/images/documentary-webp/doc-09-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-09-md.webp",
      "alt": "Waterscape Photography — Sunset boat journey across tranquil waters. Canon EOS 200D · 55mm · ISO 100 · f/8 · 1/100s"
    },
    {
      "src": "assets/images/documentary-webp/doc-10-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-10-md.webp",
      "alt": "Architecture Photography — Modern architectural lines and symmetry. Canon EOS 200D · 18mm · ISO 200 · f/10 · 1/100s"
    },
    {
      "src": "assets/images/documentary-webp/doc-11-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-11-md.webp",
      "alt": "Long Exposure Photography — Motion blur of an express train at platform. Canon EOS 200D · 24mm · ISO 100 · f/22 · 8s"
    },
    {
      "src": "assets/images/documentary-webp/doc-12-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-12-md.webp",
      "alt": "Visual Research Cover — Photography Project — Department of Film Tech & TV Production, SV Polytechnic Bhopal"
    },
    {
      "src": "assets/images/documentary-webp/doc-13-lg.webp",
      "thumb": "assets/images/documentary-webp/doc-13-md.webp",
      "alt": "Behind the Lens Study — Photographer with tripod at twilight"
    }
  ]
};

  const galleryTitles = {
    childhood: 'Childhood &amp; Family Portraits (45 Works)',
    celebrations: 'Celebrations &amp; Milestones (73 Works)',
    product: 'Objects in Focus — Commercial &amp; Product (16 Works)',
    documentary: 'Visual Research &amp; Documentaries — S.V. Polytechnic Bhopal (13 Works)',
    bts: 'Behind the Frame — On-Set &amp; Cinematography (17 Frames)'
  };

  // =========================================================
  // 6. LIGHTBOX VIEWER
  // =========================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxAlt = document.getElementById('lightboxAlt');

  let currentGallery = null;
  let currentIndex = 0;

  function openLightbox(gallery, index) {
    if (!galleries[gallery]) return;
    currentGallery = gallery;
    currentIndex = index;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    updateLightboxImage();
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    currentGallery = null;
  }

  function preloadNeighboringImages() {
    if (!currentGallery || !galleries[currentGallery]) return;
    const imgs = galleries[currentGallery];
    const len = imgs.length;
    const nextIdx = (currentIndex + 1) % len;
    const prevIdx = (currentIndex - 1 + len) % len;
    if (imgs[nextIdx]) {
      const imgNext = new Image();
      imgNext.src = imgs[nextIdx].src;
    }
    if (imgs[prevIdx]) {
      const imgPrev = new Image();
      imgPrev.src = imgs[prevIdx].src;
    }
  }

  function updateLightboxImage() {
    if (!currentGallery || !galleries[currentGallery]) return;
    const imgs = galleries[currentGallery];
    const item = imgs[currentIndex];
    if (!item) return;

    lightboxImg.classList.add('is-transitioning');
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxAlt.textContent = item.alt;
      lightboxCounter.textContent = `${currentIndex + 1} / ${imgs.length}`;
      lightboxImg.classList.remove('is-transitioning');
      preloadNeighboringImages();
    }, 150);
  }

  function nextImage() {
    if (!currentGallery) return;
    const len = galleries[currentGallery].length;
    currentIndex = (currentIndex + 1) % len;
    updateLightboxImage();
  }

  function prevImage() {
    if (!currentGallery) return;
    const len = galleries[currentGallery].length;
    currentIndex = (currentIndex - 1 + len) % len;
    updateLightboxImage();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.querySelectorAll('.project__img[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.dataset.lightbox, parseInt(img.dataset.index, 10));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!currentGallery) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextImage();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevImage();
  });

  // =========================================================
  // 7. FULL SERIES GALLERY MODAL (High-Performance Batch Render)
  // =========================================================
  const galleryModal = document.getElementById('galleryModal');
  const galleryModalClose = document.getElementById('galleryModalClose');
  const galleryModalTitle = document.getElementById('galleryModalTitle');
  const galleryModalGrid = document.getElementById('galleryModalGrid');

  function openGallery(galleryKey) {
    const items = galleries[galleryKey];
    if (!items || !galleryModal) return;

    galleryModalTitle.innerHTML = galleryTitles[galleryKey] || galleryKey;
    galleryModalGrid.innerHTML = '';

    const fragment = document.createDocumentFragment();

    items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'gallery-modal__item';
      
      const img = document.createElement('img');
      img.src = item.thumb || item.src;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      
      img.addEventListener('click', () => {
        closeGalleryModal();
        setTimeout(() => openLightbox(galleryKey, idx), 200);
      });
      
      card.appendChild(img);
      fragment.appendChild(card);
    });

    galleryModalGrid.appendChild(fragment);
    galleryModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (galleryModalClose) galleryModalClose.focus();
  }

  function closeGalleryModal() {
    if (!galleryModal) return;
    galleryModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (galleryModalClose) galleryModalClose.addEventListener('click', closeGalleryModal);
  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) closeGalleryModal();
    });
  }

  document.querySelectorAll('[data-open-gallery]').forEach(btn => {
    btn.addEventListener('click', () => openGallery(btn.dataset.openGallery));
  });

  // =========================================================
  // 8. FILMS FILTER TABS
  // =========================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filmCards = document.querySelectorAll('.film-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;
      filmCards.forEach(card => {
        if (filter === 'all' || card.dataset.categoryType === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================
  // 9. CINEMA VIDEO PLAYER MODAL & LAZY HOVER PREVIEWS
  // =========================================================
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalBackdrop = document.getElementById('videoModalBackdrop');
  const videoPlayer = document.getElementById('videoPlayer');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalCategory = document.getElementById('videoModalCategory');
  const videoModalDesc = document.getElementById('videoModalDesc');

  function openVideoModal(videoSrc, title, category, desc) {
    if (!videoModal || !videoPlayer) return;
    videoModalTitle.textContent = title || '';
    videoModalCategory.textContent = category || 'Film';
    videoModalDesc.textContent = desc || '';
    videoPlayer.src = videoSrc;
    videoModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    videoPlayer.currentTime = 0;
    videoPlayer.play().catch(() => {});
    if (videoModalClose) videoModalClose.focus();
  }

  function closeVideoModal() {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.pause();
    videoPlayer.src = '';
    videoModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && !videoModal.hasAttribute('hidden')) {
      closeVideoModal();
    }
  });

  filmCards.forEach(card => {
    const previewVideo = card.querySelector('.film-card__video-preview');

    card.addEventListener('mouseenter', () => {
      if (previewVideo) {
        if (previewVideo.dataset.src && !previewVideo.src) {
          previewVideo.src = previewVideo.dataset.src;
        }
        previewVideo.play().catch(() => {});
      }
      if (cursor && !isTouchDevice) {
        cursor.classList.add('is-hovering');
        cursor.querySelector('.cursor__label').textContent = 'PLAY';
      }
    });

    card.addEventListener('mouseleave', () => {
      if (previewVideo) {
        previewVideo.pause();
      }
      if (cursor && !isTouchDevice) {
        cursor.classList.remove('is-hovering');
        cursor.querySelector('.cursor__label').textContent = '';
      }
    });

    card.addEventListener('click', () => {
      const src = card.dataset.video;
      const title = card.dataset.title;
      const category = card.dataset.category;
      const desc = card.dataset.desc;
      if (src) openVideoModal(src, title, category, desc);
    });
  });

  // =========================================================
  // 10. HERO TITLE SPLIT & SMOOTH ANCHORS
  // =========================================================
  document.querySelectorAll('.hero__title-line').forEach(line => {
    const text = line.textContent.trim();
    line.innerHTML = `<span>${text}</span>`;
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
