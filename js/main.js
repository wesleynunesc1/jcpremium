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
  initSmsTriggers();
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
   17. CONTACT — MODAL, SMS DISPATCHER & NATIVE MESSAGING
   ========================================================================== */
const SMS_PHONE = '+15619311858';
const SMS_PHONE_DISPLAY = '+1 (561) 931-1858';

/**
 * Native SMS launcher with iOS (&body=) vs Android/Desktop (?body=) compatibility
 */
function sendSMS(messageText) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const separator = isIOS ? '&' : '?';
  const encodedBody = encodeURIComponent(messageText);
  const smsUrl = `sms:${SMS_PHONE}${separator}body=${encodedBody}`;
  
  // Trigger system SMS client
  window.location.href = smsUrl;
}

/**
 * Build formatted inquiry message template matching JC Premium standard
 */
function buildContactInquiryMessage(data) {
  return [
    'JC PREMIUM — NEW PROJECT INQUIRY',
    '',
    'Hello! I would like to discuss a project with JC Premium.',
    '',
    `Name: ${data.name || ''}`,
    data.company ? `Company: ${data.company}` : null,
    `Phone: ${data.phone || ''}`,
    data.email ? `Email: ${data.email}` : null,
    data.location ? `Location: ${data.location}` : null,
    '',
    `Inquiry: ${data.inquiryType || 'Stone Sourcing'}`,
    data.category ? `Stone: ${data.category}` : null,
    data.material ? `Material: ${data.material}` : null,
    '',
    'Project Details:',
    data.details ? data.details : 'Requesting consultation on available slab lots and project specifications.',
    '',
    'I look forward to hearing from your team.'
  ].filter(line => line !== null).join('\n');
}

/**
 * Handle direct contextual SMS triggers across all sections
 */
function initSmsTriggers() {
  const triggers = document.querySelectorAll('[data-sms-trigger]');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.getAttribute('data-sms-trigger');
      const stoneName = trigger.getAttribute('data-stone') || '';

      let message = '';

      switch (type) {
        case 'header':
        case 'footer':
          message = "Hello JC Premium! I'd like to discuss a stone project.";
          break;
        case 'hero':
          message = "Hello JC Premium! I'd like to discuss a stone project.";
          break;
        case 'sourcing':
          message = "Hello JC Premium! I need assistance sourcing stone for a project.";
          break;
        case 'material':
          message = `Hello JC Premium! I'm interested in ${stoneName || 'curated stone'}. Could you share more details?`;
          break;
        case 'bespoke':
          message = "Hello JC Premium! I'd like to request details about custom stone applications.";
          break;
        case 'applications':
          message = "Hello JC Premium! I'd like to request details about custom stone applications.";
          break;
        case 'countertops':
          message = "Hello JC Premium! I'd like to request a quote for a countertop project.";
          break;
        case 'contact':
          message = "Hello JC Premium! I'd like to discuss a new project.";
          break;
        default:
          message = "Hello JC Premium! I'd like to discuss a stone project.";
      }

      sendSMS(message);
    });
  });
}

function initContactModal() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const modalOverlay = document.getElementById('contactModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const form = document.getElementById('modalContactForm');
  const btnCopyNumber = document.getElementById('btnCopyNumber');
  const btnCopyMessage = document.getElementById('btnCopyMessage');
  const copyFeedback = document.getElementById('copyFeedback');

  if (!modalOverlay) return;

  const openModal = () => {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (copyFeedback) copyFeedback.textContent = '';
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

  const getFormData = () => ({
    name: document.getElementById('modalName')?.value.trim() || '',
    company: document.getElementById('modalCompany')?.value.trim() || '',
    phone: document.getElementById('modalPhone')?.value.trim() || '',
    email: document.getElementById('modalEmail')?.value.trim() || '',
    location: document.getElementById('modalLocation')?.value.trim() || '',
    inquiryType: document.getElementById('modalType')?.value || '',
    category: document.getElementById('modalCategory')?.value || '',
    details: document.getElementById('modalDetails')?.value.trim() || ''
  });

  // Copy Phone Number fallback
  btnCopyNumber?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SMS_PHONE_DISPLAY);
      if (copyFeedback) {
        copyFeedback.textContent = currentLanguage === 'es' 
          ? `✓ Número copiado: ${SMS_PHONE_DISPLAY}` 
          : `✓ Number copied: ${SMS_PHONE_DISPLAY}`;
      }
    } catch (err) {
      if (copyFeedback) copyFeedback.textContent = SMS_PHONE_DISPLAY;
    }
  });

  // Copy Structured Message fallback
  btnCopyMessage?.addEventListener('click', async () => {
    const data = getFormData();
    const msg = buildContactInquiryMessage(data);
    try {
      await navigator.clipboard.writeText(msg);
      if (copyFeedback) {
        copyFeedback.textContent = currentLanguage === 'es'
          ? '✓ Mensaje copiado al portapapeles'
          : '✓ Message copied to clipboard';
      }
    } catch (err) {
      if (copyFeedback) copyFeedback.textContent = 'Please copy text manually.';
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = getFormData();

      if (!data.name || !data.phone) {
        alert(currentLanguage === 'es' 
          ? 'Por favor ingrese su nombre y teléfono.' 
          : 'Please provide your name and phone number.');
        return;
      }

      const msg = buildContactInquiryMessage(data);

      // Launch native SMS
      sendSMS(msg);

      // Also copy to clipboard in case device does not link SMS client
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).catch(() => {});
      }

      if (copyFeedback) {
        copyFeedback.textContent = currentLanguage === 'es' 
          ? 'Abriendo SMS...' 
          : 'Opening messaging app...';
      }

      setTimeout(() => {
        closeModal();
      }, 1200);
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
