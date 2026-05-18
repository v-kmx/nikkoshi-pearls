/* ============================================
   NIKKOSHI PEARLS — Main JavaScript
   Handles: burger menu, hero slider, scroll
   animations, header shrink, temple page content,
   dark mode toggle
   ============================================ */

/* ===================== DARK MODE (runs immediately) ===================== */
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', stored || (systemDark ? 'dark' : 'light'));
})();

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initBurgerMenu();
  initHeroSlider();
  initScrollReveal();
  initHeaderShrink();
  initSmoothScroll();
  initArticleSearch();
  initItineraryTabs();
});

/* ===================== DARK MODE TOGGLE ===================== */
function initDarkMode() {
  const togglers = document.querySelectorAll('[data-theme-toggler]');
  togglers.forEach(btn => {
    btn.addEventListener('click', () => {
      const root = document.documentElement;
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-transition');
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      setTimeout(() => root.classList.remove('theme-transition'), 400);
    });
  });
}

/* ===================== BURGER MENU ===================== */
function initBurgerMenu() {
  const btn = document.getElementById('burger-btn');
  const overlay = document.getElementById('overlay-menu');
  const scrim = document.getElementById('overlay-scrim');
  if (!btn || !overlay) return;

  function closeMenu() {
    btn.classList.remove('active');
    overlay.classList.remove('active');
    if (scrim) scrim.classList.remove('active');
  }

  function toggleMenu() {
    const isOpen = overlay.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      btn.classList.add('active');
      overlay.classList.add('active');
      if (scrim) scrim.classList.add('active');
    }
  }

  btn.addEventListener('click', toggleMenu);

  // Close menu when clicking the scrim (background)
  if (scrim) {
    scrim.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a link
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ===================== HERO SLIDER ===================== */
function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  const dotsContainer = document.getElementById('hero-dots');
  if (!slider || !dotsContainer) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = dotsContainer.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let currentSlide = 0;
  let interval;
  let isPaused = false;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startAutoPlay() {
    interval = setInterval(() => {
      if (!isPaused) nextSlide();
    }, 5000);
  }

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide);
      goToSlide(slideIndex);
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => { isPaused = true; });
  slider.addEventListener('mouseleave', () => { isPaused = false; });

  startAutoPlay();
}

/* ===================== SCROLL REVEAL ===================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ===================== HEADER SHRINK ===================== */
function initHeaderShrink() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      header.classList.add('compact');
    } else {
      header.classList.remove('compact');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ===================== SMOOTH SCROLL ===================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ===================== ARTICLE SEARCH ===================== */
function initArticleSearch() {
  const input = document.getElementById('search-input');
  const articlesList = document.getElementById('articles-list');
  if (!input || !articlesList) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    const cards = articlesList.querySelectorAll('.article-list-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/* ===================== ITINERARY TABS ===================== */
function initItineraryTabs() {
  const tabs = document.querySelectorAll('.itinerary-tab');
  const panels = document.querySelectorAll('.itinerary-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const route = tab.dataset.route;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show corresponding panel
      panels.forEach(p => p.classList.remove('active'));
      const target = document.getElementById('route-' + route);
      if (target) target.classList.add('active');
    });
  });
}
