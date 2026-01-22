/**
 * ShaniOS Wiki – Unified UI Script
 * Fully aligned with HTML structure
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSearch();
  initFAQ();
  initScrollSpy();
  initResponsiveEnhancements();
  initBackToTop();
  initSyntaxHighlighting();
  initPrintSupport();
  initThemeSwitcher();
  initCopyrightYear();
});

/* =====================================================
   SIDEBAR + MOBILE NAV (Overlay, Escape, Focus Trap)
===================================================== */
function initNavigation() {
  const sidebar = document.querySelector('.sidebar');
  const container = document.querySelector('.wiki-container');
  if (!sidebar || !container) return;

  /* ---------- Dropdowns ---------- */
  document.querySelectorAll('.dropdown-link').forEach(link => {
    link.setAttribute('aria-expanded', 'false');

    link.addEventListener('click', e => {
      e.preventDefault();
      const expanded = link.getAttribute('aria-expanded') === 'true';
      link.setAttribute('aria-expanded', String(!expanded));

      const submenu = link.nextElementSibling;
      if (!submenu) return;

      submenu.classList.toggle('active');
      submenu.style.height = submenu.classList.contains('active')
        ? `${submenu.scrollHeight}px`
        : '0px';
    });
  });

  /* ---------- Mobile Toggle ---------- */
  const toggle = document.createElement('button');
  toggle.className = 'mobile-nav-toggle menu-toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<i class="fas fa-bars"></i>';
  container.prepend(toggle);

  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  const openMenu = () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('i')?.classList.replace('fa-bars', 'fa-times');
  };

  const closeMenu = () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
  };

  toggle.addEventListener('click', () =>
    sidebar.classList.contains('active') ? closeMenu() : openMenu()
  );

  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeMenu();
    }
  });

  /* ---------- Focus Trap ---------- */
  const focusables = sidebar.querySelectorAll('a, button, input');
  if (focusables.length) {
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    sidebar.addEventListener('keydown', e => {
      if (!sidebar.classList.contains('active') || e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
}

/* =====================================================
   SEARCH (Wiki Headings)
===================================================== */
function initSearch() {
  const box = document.querySelector('.search-box');
  if (!box) return;

  const input = box.querySelector('input');
  const button = box.querySelector('button');

  const results = document.createElement('div');
  results.className = 'search-results';
  box.appendChild(results);

  let debounce;

  input.addEventListener('input', () => {
    clearTimeout(debounce);
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) {
      results.style.display = 'none';
      return;
    }

    debounce = setTimeout(() => {
      const matches = [];
      document
        .querySelectorAll('.wiki-section h2, .wiki-section h3, .wiki-section h4')
        .forEach(h => {
          if (h.textContent.toLowerCase().includes(q)) {
            const section = h.closest('[id]');
            if (section?.id) {
              matches.push({ text: h.textContent, id: section.id });
            }
          }
        });

      results.innerHTML = matches.length
        ? `<ul>${matches
            .map(m => `<li><a href="#${m.id}">${m.text}</a></li>`)
            .join('')}</ul>`
        : `<p style="padding:8px">No results</p>`;

      results.style.display = 'block';
    }, 200);
  });

  document.addEventListener('click', e => {
    if (!box.contains(e.target)) results.style.display = 'none';
  });

  button?.addEventListener('click', e => e.preventDefault());
}

/* =====================================================
   FAQ ACCORDION
===================================================== */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    const icon = q?.querySelector('.toggle-icon i');
    if (!q || !a) return;

    item.setAttribute('aria-expanded', 'false');

    q.addEventListener('click', () => {
      const open = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('active');
      a.style.maxHeight = open ? '0' : `${a.scrollHeight}px`;
      
      // Toggle icon
      if (icon) {
        if (open) {
          icon.classList.replace('fa-minus', 'fa-plus');
        } else {
          icon.classList.replace('fa-plus', 'fa-minus');
        }
      }
    });
  });
}

/* =====================================================
   SCROLLSPY (Improved thresholds)
===================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('.wiki-section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link =>
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          )
        );
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0.1 }
  );

  sections.forEach(s => observer.observe(s));

  /* Smooth scroll with header offset */
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      const header = document.querySelector('.header');
      const offset = header?.offsetHeight || 0;

      window.scrollTo({
        top: target.offsetTop - offset - 20,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      const sidebar = document.querySelector('.sidebar');
      if (sidebar?.classList.contains('active')) {
        document.querySelector('.menu-overlay')?.click();
      }
    });
  });
}

/* =====================================================
   RESPONSIVE ENHANCEMENTS
===================================================== */
function initResponsiveEnhancements() {
  document.querySelectorAll('table').forEach(t => {
    if (t.parentElement.classList.contains('table-responsive')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-responsive';
    t.before(wrap);
    wrap.appendChild(t);
  });

  document.querySelectorAll('img').forEach(img => {
    img.classList.add('img-fluid');
    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', '');
    }
  });
}

/* =====================================================
   BACK TO TOP (Unified behavior)
===================================================== */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top');
  
  // If button already exists in HTML, use it
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 300);
    btn.classList.toggle('show', window.scrollY > 300);
  });

  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* =====================================================
   SYNTAX HIGHLIGHTING
===================================================== */
function initSyntaxHighlighting() {
  if (window.hljs) hljs.highlightAll();
}

/* =====================================================
   PRINT SUPPORT
===================================================== */
function initPrintSupport() {
  const header = document.querySelector('.header');
  if (!header) return;

  let actions = document.querySelector('.header-actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'header-actions';
    header.appendChild(actions);
  }

  const btn = document.createElement('button');
  btn.innerHTML = '<i class="fas fa-print"></i> Print';
  btn.setAttribute('aria-label', 'Print page');
  actions.appendChild(btn);

  btn.addEventListener('click', () => window.print());
}

/* =====================================================
   THEME SWITCHER
===================================================== */
function initThemeSwitcher() {
  const iconSun = '<i class="fas fa-sun"></i>';
  const iconMoon = '<i class="fas fa-moon"></i>';

  let btn = document.querySelector('.theme-switcher');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'theme-switcher';
    btn.setAttribute('aria-label', 'Toggle theme');
    document.querySelector('.header-actions')?.prepend(btn);
  }

  const stored = localStorage.getItem('shanios-theme');
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', theme);
  btn.innerHTML = theme === 'dark' ? iconSun : iconMoon;
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

  btn.addEventListener('click', () => {
    const next =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('shanios-theme', next);
    btn.innerHTML = next === 'dark' ? iconSun : iconMoon;
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

/* =====================================================
   COPYRIGHT YEAR (ROBUST + SAFE)
===================================================== */
function initCopyrightYear() {
  const year = new Date().getFullYear();

  // Preferred modern selector (if you add later)
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = year;
  });

  // Current footer (ID-based)
  const legacy = document.getElementById('copyright-year');
  if (legacy) {
    legacy.textContent = year;
  }
}
