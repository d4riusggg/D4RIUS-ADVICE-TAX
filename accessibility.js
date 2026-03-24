/**
 * accessibility.js — d4riusTAX ADVICE S.R.L
 * Standard accessibility & UX enhancements
 */

(function () {
  'use strict';

  /* ── 1. SKIP TO MAIN CONTENT LINK ─────────────────────────────
     Apare la Tab, dispare la click — standard gov/enterprise     */
  function initSkipLink() {
    const skip = document.createElement('a');
    skip.href = '#servicii';
    skip.textContent = 'Sari la conținut principal';
    skip.setAttribute('class', 'skip-link');
    Object.assign(skip.style, {
      position: 'fixed', top: '-60px', left: '16px', zIndex: '99999',
      background: '#14314d', color: '#fff', padding: '10px 20px',
      borderRadius: '0 0 8px 8px', fontWeight: '700', fontSize: '14px',
      textDecoration: 'none', transition: 'top .2s', outline: 'none'
    });
    skip.addEventListener('focus', () => { skip.style.top = '0'; });
    skip.addEventListener('blur',  () => { skip.style.top = '-60px'; });
    document.body.prepend(skip);
  }

  /* ── 2. FOCUS VISIBLE (keyboard nav ring) ─────────────────────
     Ascunde ring-ul la mouse, îl arata la tastatură              */
  function initFocusVisible() {
    let usingMouse = false;
    document.addEventListener('mousedown', () => { usingMouse = true; });
    document.addEventListener('keydown',   () => { usingMouse = false; });
    document.addEventListener('focusin', (e) => {
      if (usingMouse) {
        e.target.style.outline = 'none';
      } else {
        e.target.style.outline = '3px solid #ff7a18';
        e.target.style.outlineOffset = '3px';
      }
    });
    document.addEventListener('focusout', (e) => {
      e.target.style.outline = '';
      e.target.style.outlineOffset = '';
    });
  }

  /* ── 3. ARIA LABELS automate ──────────────────────────────────
     Adaugă role/aria pe elementele fără label explicit           */
  function initAriaLabels() {
    // Butoane cu doar emoji sau iconiță
    document.querySelectorAll('button:not([aria-label])').forEach(btn => {
      const txt = btn.textContent.trim();
      if (!txt || txt.length <= 2) {
        btn.setAttribute('aria-label', btn.title || 'buton');
      }
    });

    // Imagini fără alt
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    });

    // Linkuri externe — anunță screen reader
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
      if (!a.querySelector('.sr-only') && !a.getAttribute('aria-label')) {
        const notice = document.createElement('span');
        notice.className = 'sr-only';
        notice.textContent = ' (se deschide în filă nouă)';
        Object.assign(notice.style, {
          position: 'absolute', width: '1px', height: '1px',
          overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap'
        });
        a.appendChild(notice);
      }
    });

    // Nav principal
    const nav = document.querySelector('header nav');
    if (nav && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Navigare principală');
    }

    // Secțiuni fără aria-label
    const sectionLabels = {
      servicii: 'Serviciile noastre',
      despre:   'Despre noi',
      blog:     'Blog',
      contact:  'Contact'
    };
    Object.entries(sectionLabels).forEach(([id, label]) => {
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', label);
      }
    });
  }

  /* ── 4. REDUCED MOTION ────────────────────────────────────────
     Opreste animatii pentru utilizatorii cu sensibilitate        */
  function initReducedMotion() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function apply(reduced) {
      if (reduced) {
        const style = document.createElement('style');
        style.id = 'reduced-motion-styles';
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        `;
        document.head.appendChild(style);
      } else {
        const existing = document.getElementById('reduced-motion-styles');
        if (existing) existing.remove();
      }
    }
    apply(mq.matches);
    mq.addEventListener('change', e => apply(e.matches));
  }

  /* ── 5. ESCAPE KEY — inchide modals/chatbot ──────────────────  */
  function initEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;

      // Blog modal
      const blogOverlay = document.getElementById('blog-modal-overlay');
      if (blogOverlay && blogOverlay.style.display !== 'none') {
        if (typeof closeModal === 'function') closeModal();
        return;
      }

      // Confirm overlay chatbot
      const confirmOverlay = document.getElementById('confirm-overlay');
      if (confirmOverlay && confirmOverlay.classList.contains('visible')) {
        if (typeof cancelConfirm === 'function') cancelConfirm();
        return;
      }

      // Chatbot box
      const chatbox = document.getElementById('chatbot-box');
      if (chatbox && chatbox.style.display === 'flex') {
        chatbox.style.display = 'none';
      }
    });
  }

  /* ── 6. LANG ATTRIBUTE verificare ────────────────────────────  */
  function initLang() {
    const html = document.documentElement;
    if (!html.getAttribute('lang')) {
      html.setAttribute('lang', 'ro');
    }
  }

  /* ── 7. CONTRAST & COLOR SCHEME ──────────────────────────────
     Respecta preferinta dark mode a sistemului                   */
  function initColorScheme() {
    const meta = document.createElement('meta');
    meta.name = 'color-scheme';
    meta.content = 'light';
    document.head.appendChild(meta);
  }

  /* ── 8. CHATBOT ACCESSIBILITY ────────────────────────────────  */
  function initChatbotA11y() {
    const btn = document.getElementById('chatbot-btn');
    if (btn) {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', 'Deschide chat asistent');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    }

    const chatbox = document.getElementById('chatbot-box');
    if (chatbox) {
      chatbox.setAttribute('role', 'dialog');
      chatbox.setAttribute('aria-label', 'Asistent virtual d4riusTAX');
      chatbox.setAttribute('aria-modal', 'true');
    }

    const input = document.getElementById('expert-input');
    if (input) {
      input.setAttribute('aria-label', 'Scrie întrebarea ta');
    }
  }

  /* ── INIT ────────────────────────────────────────────────────  */
  function init() {
    initSkipLink();
    initFocusVisible();
    initReducedMotion();
    initEscapeKey();
    initLang();
    initColorScheme();

    // Elementele DOM sunt gata după DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initAriaLabels();
        initChatbotA11y();
      });
    } else {
      initAriaLabels();
      initChatbotA11y();
    }
  }

  init();

})();