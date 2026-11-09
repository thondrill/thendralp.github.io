/**
 * Thendral Prabu — Minimal Academic Portfolio
 * Lightweight Client Logic:
 * 1. Dark/Light Theme Switching with Persistence
 * 2. Active Section Spy for Navigation Links
 * 3. Mobile Menu Handling
 * 4. Minimalist Image Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode)
  // -------------------------------------------------------------------------
  const htmlRoot = document.documentElement;
  const btnThemeToggle = document.getElementById('btnThemeToggle');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 2. Active Navigation Spy via IntersectionObserver
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-links .nav-link:not(.cv-link)');

  if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Menu Handling
  // -------------------------------------------------------------------------
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const navLinksContainer = document.getElementById('navLinks');

  if (btnMobileMenu && navLinksContainer) {
    btnMobileMenu.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('mobile-open');
      btnMobileMenu.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
        btnMobileMenu.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !btnMobileMenu.contains(e.target)) {
        navLinksContainer.classList.remove('mobile-open');
        btnMobileMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Accessible Minimalist Lightbox for Project Images
  // -------------------------------------------------------------------------
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const btnLightboxClose = document.getElementById('btnLightboxClose');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  function openLightbox(src, caption, alt) {
    if (!lightboxOverlay || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt || caption || 'Project preview';
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || '';
    }
    lightboxOverlay.classList.add('active');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('active');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const fullSrc = trigger.getAttribute('data-full') || trigger.src;
      const caption = trigger.getAttribute('data-caption') || '';
      const alt = trigger.alt || '';
      openLightbox(fullSrc, caption, alt);
    });
  });

  if (btnLightboxClose) {
    btnLightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay && lightboxOverlay.classList.contains('active')) {
      closeLightbox();
    }
  });
});
