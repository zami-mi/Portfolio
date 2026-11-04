
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'portfolio_lang';
  let currentLang = 'es';

  function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    const t = translations[lang];

    if (t.pageTitle) document.title = t.pageTitle;
    const metaDesc = document.getElementById('meta-description');
    if (metaDesc && t.pageDescription) metaDesc.setAttribute('content', t.pageDescription);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (t[key] !== undefined) {
        el.setAttribute('aria-label', t[key]);
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (t[key] !== undefined) {
        el.setAttribute('alt', t[key]);
      }
    });

    const subjectInput = document.getElementById('form-subject');
    if (subjectInput && t.formSubject) {
      subjectInput.value = t.formSubject;
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      const isActive = btnLang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
      const isOpen = navMenu.classList.contains('active');
      menuToggle.setAttribute('aria-label', isOpen ? t.menuToggleAriaClose : t.menuToggleAriaOpen);
    }
  }

  (function initLanguage() {
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && typeof translations !== 'undefined' && translations[savedLang]) {
      currentLang = savedLang;
    } else {
      const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      currentLang = navLang.startsWith('en') ? 'en' : 'es';
    }
    setLanguage(currentLang);
  })();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      if (lang !== currentLang) {
        setLanguage(lang);
      }
    });
  });

  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-links a');

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      const t = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : (translations?.es || {});
      if (t.menuToggleAriaOpen) {
        menuToggle.setAttribute('aria-label', t.menuToggleAriaOpen);
      }
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  }

  function openMenu() {
    if (!navMenu) return;
    navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
      const t = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : (translations?.es || {});
      if (t.menuToggleAriaClose) {
        menuToggle.setAttribute('aria-label', t.menuToggleAriaClose);
      }
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    }
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }
});
