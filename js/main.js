/**
 * JC PREMIUM LLC — GOLUBEV STONE LUXURY EDITORIAL EXPERIENCE
 * Core Architecture: Stacked Sticky Panels, Interactive Sourcing Journey,
 * Bookmatch / Quadmatch Simulator, Bespoke Carousel & Web Audio Synthesizer.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initStackPanels();
  initHeader();
  initBespokeSlider();
  initJourneyGrid();
  initBookmatchSimulator();
  initAppTabs();
  initHorizontalGallery();
  initContactModal();
  initInteractiveLighting();
});

/* ==========================================================================
   LANGUAGE SWITCHER (ENGLISH & SPANISH)
   ========================================================================== */
let currentLanguage = 'en';

function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  if (!langButtons.length) return;

  function setLanguage(lang) {
    if (!DICT || !DICT[lang]) return;
    currentLanguage = lang;

    // Update active button state
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Translate DOM elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = DICT[lang][key];
      if (translation !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.innerHTML = translation;
        }
      }
    });

    // Refresh active stage in journey grid if present
    const activeJourneyBtn = document.querySelector('#journey-grid button.active');
    if (activeJourneyBtn) {
      const stageNameEl = document.getElementById('stage-name');
      const stageDescEl = document.getElementById('stage-description');
      if (stageNameEl && stageDescEl) {
        stageNameEl.textContent = activeJourneyBtn.querySelector('b')?.textContent || '';
        stageDescEl.textContent = activeJourneyBtn.dataset.detail || '';
      }
    }

    // Refresh active app tab text
    const activeAppBtn = document.querySelector('#app-tabs button.active');
    if (activeAppBtn) {
      const appLabelEl = document.getElementById('app-label');
      const appTextEl = document.getElementById('app-text');
      if (appLabelEl && appTextEl) {
        appLabelEl.textContent = activeAppBtn.dataset.label;
        appTextEl.textContent = activeAppBtn.dataset.text;
      }
    }
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
    });
  });
}

/* ==========================================================================
   04. SISTEMA PRINCIPAL DE SCROLL — STACKED PANELS
   ========================================================================== */
function initStackPanels() {
  const stackPanels = [...document.querySelectorAll('main > section')];
  if (!stackPanels.length) return;

  function measureStack() {
    const isMobileOrTablet = window.innerWidth <= 1024;
    const navCompact = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-compact')) || 73;

    stackPanels.forEach((panel, i) => {
      panel.style.setProperty('--stack-order', i + 1);

      if (isMobileOrTablet) {
        // Safe natural scrolling on mobile/tablets: disable sticky offset completely
        panel.style.removeProperty('--sticky-top');
      } else {
        // Desktop: anchor cleanly below the fixed compact navigation bar
        const maxOffset = window.innerHeight - panel.offsetHeight;
        const topOffset = Math.min(navCompact, maxOffset > 0 ? navCompact : maxOffset);
        panel.style.setProperty('--sticky-top', `${Math.max(navCompact, topOffset)}px`);
      }
    });
  }

  const stackResize = new ResizeObserver(measureStack);
  stackPanels.forEach(p => stackResize.observe(p));
  window.addEventListener('resize', measureStack);
  measureStack();
}

/* ==========================================================================
   05. HEADER COMPACTION & MOBILE NAVIGATION
   ========================================================================== */
function initHeader() {
  const fixedHeader = document.querySelector('header.nav');
  const heroSection = document.querySelector('main > section.hero');
  const menuBtn = document.querySelector('.menu-btn');
  const navlinks = document.querySelector('.navlinks');

  let headerFrame = 0;
  function updateHeader() {
    if (!heroSection || !fixedHeader) return;
    fixedHeader.classList.toggle('is-compact', window.scrollY >= (heroSection.offsetHeight - 80));
    headerFrame = 0;
  }

  window.addEventListener('scroll', () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
  }, { passive: true });

  window.addEventListener('resize', updateHeader);
  updateHeader();

  if (menuBtn && navlinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navlinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.textContent = isOpen ? 'Close' : 'Menu';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navlinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navlinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
        document.body.style.overflow = '';
      });
    });
  }
}

/* ==========================================================================
   09. SOURCING JOURNEY — PROCESSO INTERATIVO
   ========================================================================== */
function initJourneyGrid() {
  const buttons = document.querySelectorAll('#journey-grid button');
  const stageName = document.getElementById('stage-name');
  const stageDesc = document.getElementById('stage-description');

  if (!buttons.length || !stageName || !stageDesc) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('#journey-grid .active')?.classList.remove('active');
      btn.classList.add('active');

      const name = btn.querySelector('b')?.textContent || '';
      const detail = btn.dataset.detail || '';

      stageName.textContent = name;
      stageDesc.textContent = detail;
    });
  });
}

/* ==========================================================================
   10. STONE GALLERY — SCROLL HORIZONTAL
   ========================================================================== */
function initHorizontalGallery() {
  const track = document.querySelector('.gallery-track');
  const dirButtons = document.querySelectorAll('[data-gallery-dir]');

  if (!track || !dirButtons.length) return;

  dirButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = Number(btn.dataset.galleryDir);
      track.scrollBy({
        left: dir * track.clientWidth * 0.7,
        behavior: 'smooth'
      });
    });
  });
}

/* ==========================================================================
   11. CUSTOM STONE APPLICATIONS — CARROSSEL CINEMATOGRÁFICO
   ========================================================================== */
function initBespokeSlider() {
  const container = document.querySelector('.bespoke-img');
  const slides = document.querySelectorAll('.bespoke-slide');
  const captionEl = document.getElementById('bespoke-caption');
  const countEl = document.getElementById('bespoke-count');
  const pauseBtn = document.getElementById('bespoke-pause');

  if (!slides.length || !container) return;

  let currentIndex = 0;
  let isPlaying = true;
  let interval = null;

  function showSlide(index) {
    slides.forEach((s, idx) => {
      s.classList.remove('active', 'leaving');
      if (idx === currentIndex && idx !== index) {
        s.classList.add('leaving');
      }
    });

    currentIndex = (index + slides.length) % slides.length;
    const currentSlide = slides[currentIndex];
    currentSlide.classList.add('active');

    if (captionEl) captionEl.textContent = currentSlide.dataset.caption || currentSlide.alt;
    if (countEl) countEl.textContent = `${currentIndex + 1} / ${slides.length}`;
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(nextSlide, 4500);
    isPlaying = true;
    if (pauseBtn) pauseBtn.textContent = 'Pause';
  }

  function stopAutoplay() {
    if (interval) clearInterval(interval);
    isPlaying = false;
    if (pauseBtn) pauseBtn.textContent = 'Play';
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // Initialize
  showSlide(0);
  startAutoplay();
}

/* ==========================================================================
   12. BOOKMATCH & QUADMATCH — SIMULADOR INTERATIVO
   ========================================================================== */
function initBookmatchSimulator() {
  const choices = document.querySelectorAll('.pattern-choice');
  const matchView = document.getElementById('match-view');
  const halves = document.querySelectorAll('.match-half');
  const modeButtons = document.querySelectorAll('.match-controls button');

  if (!matchView || !choices.length) return;

  choices.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.pattern-choice.active')?.classList.remove('active');
      btn.classList.add('active');

      const patternUrl = btn.dataset.pattern;
      halves.forEach(half => {
        half.style.backgroundImage = `url('${patternUrl}')`;
      });
    });
  });

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.match-controls .active')?.classList.remove('active');
      btn.classList.add('active');

      const isQuad = btn.dataset.mode === 'quad';
      matchView.classList.toggle('quad', isQuad);
      matchView.querySelectorAll('.match-half:nth-child(n+3)').forEach(e => {
        e.hidden = !isQuad;
      });
    });
  });

  // Trigger initial selection
  const activeChoice = document.querySelector('.pattern-choice.active');
  if (activeChoice) {
    const initPattern = activeChoice.dataset.pattern;
    halves.forEach(h => h.style.backgroundImage = `url('${initPattern}')`);
  }
}

/* ==========================================================================
   13. STONE APPLICATIONS — TABS INTERATIVAS
   ========================================================================== */
function initAppTabs() {
  const tabs = document.querySelectorAll('#app-tabs button');
  const labelEl = document.getElementById('app-label');
  const textEl = document.getElementById('app-text');
  const imgEl = document.getElementById('app-image');

  if (!tabs.length || !labelEl || !textEl || !imgEl) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('#app-tabs .active')?.classList.remove('active');
      btn.classList.add('active');

      imgEl.style.opacity = '0';
      setTimeout(() => {
        labelEl.textContent = btn.dataset.label;
        textEl.textContent = btn.dataset.text;
        imgEl.src = btn.dataset.image;
        imgEl.alt = `${btn.dataset.label} stone concept`;
        imgEl.style.opacity = '1';
      }, 150);
    });
  });
}

/* ==========================================================================
   17. CONTACT — MODAL E WHATSAPP
   ========================================================================== */
function initContactModal() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const modalOverlay = document.getElementById('contactModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const form = document.getElementById('modalContactForm');

  if (!modalOverlay) return;

  const openModal = () => {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  openButtons.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeBtn?.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('modalName')?.value.trim();
      const company = document.getElementById('modalCompany')?.value.trim();
      const phone = document.getElementById('modalPhone')?.value.trim();
      const email = document.getElementById('modalEmail')?.value.trim();
      const location = document.getElementById('modalLocation')?.value.trim();
      const inquiryType = document.getElementById('modalType')?.value;
      const category = document.getElementById('modalCategory')?.value;
      const details = document.getElementById('modalDetails')?.value.trim();

      if (!name || !phone) {
        alert('Please provide your name and phone number.');
        return;
      }

      let msg = `Hello JC Premium,\n\nI would like to discuss a project:\n`;
      msg += `• Name: ${name}\n`;
      if (company) msg += `• Company / Role: ${company}\n`;
      msg += `• Phone: ${phone}\n`;
      if (email) msg += `• Email: ${email}\n`;
      if (location) msg += `• Location: ${location}\n`;
      if (inquiryType) msg += `• Inquiry Scope: ${inquiryType}\n`;
      if (category) msg += `• Preferred Material: ${category}\n`;
      if (details) msg += `• Project Vision: ${details}\n`;

      const whatsappUrl = `https://wa.me/15619311858?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }
}

/* ==========================================================================
   18. ANIMAÇÕES DE GRAVIDADE, MEDALLION & ILUMINAÇÃO INTERATIVA
   ========================================================================== */
function initInteractiveLighting() {
  const cards = document.querySelectorAll('.library-card, .sample-tile, .origin figure');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--light-x', `${x}%`);
      card.style.setProperty('--light-y', `${y}%`);
    });
  });

  const medallion = document.querySelector('.jc-medallion');
  if (medallion) {
    medallion.addEventListener('click', () => {
      medallion.style.transform = 'rotateY(360deg) scale(1.15)';
      setTimeout(() => {
        medallion.style.transform = '';
      }, 900);
    });
  }
}
