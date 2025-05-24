/**
 * ShaniOS Wiki - Main JavaScript
 * Handles interactions, navigation, and UI enhancements for the ShaniOS Wiki
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearchBox();
    initializeFAQAccordion();
    initializeScrollSpy();
    initializeResponsiveUI();
    initializeBackToTop();
    initializeSyntaxHighlighting();
    initializePrintSupport();
    initializeThemeSwitcher();
});

/**
 * Navigation functionality
 * - Handles dropdown menus in sidebar
 * - Implements mobile navigation toggle
 */
function initializeNavigation() {
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        // set ARIA for accessibility
        link.setAttribute('aria-expanded', 'false');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            const submenu = this.nextElementSibling;
            submenu?.classList.toggle('active');
            // smooth height transition
            if (submenu) {
                submenu.style.height = submenu.classList.contains('active')
                    ? `${submenu.scrollHeight}px`
                    : '0px';
            }
        });
    });

    // mobile navigation toggle
    const container = document.querySelector('.wiki-container');
    if (!container) return;

    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.className = 'mobile-nav-toggle menu-toggle';
    mobileNavToggle.setAttribute('aria-label', 'Toggle navigation');
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    container.prepend(mobileNavToggle);

    const sidebar = document.querySelector('.sidebar');
    mobileNavToggle.addEventListener('click', function() {
        const isOpen = sidebar.classList.toggle('active');
        this.querySelector('i')?.classList.toggle('fa-times', isOpen);
        this.querySelector('i')?.classList.toggle('fa-bars', !isOpen);
    });

    // click outside to close
    document.addEventListener('click', function(e) {
        if (
            sidebar?.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !mobileNavToggle.contains(e.target)
        ) {
            sidebar.classList.remove('active');
            mobileNavToggle.querySelector('i')?.classList.replace('fa-times','fa-bars');
        }
    });
}

/**
 * Search Box Functionality
 * - Implements quick search across wiki content
 */
function initializeSearchBox() {
    const searchBox = document.querySelector('.search-box');
    if (!searchBox) return;

    searchBox.style.position = 'relative';               // ensure positioning
    const searchInput   = searchBox.querySelector('input');
    const searchButton  = searchBox.querySelector('button');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchBox.appendChild(searchResults);

    let debounce;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounce);
        const q = this.value.trim().toLowerCase();
        if (q.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        debounce = setTimeout(() => {
            const headings = document.querySelectorAll('.wiki-section h2, .wiki-section h3, .wiki-section h4');
            const matches = [];
            headings.forEach(h => {
                if (h.textContent.toLowerCase().includes(q)) {
                    const section = h.closest('section[id], [id]')?.id;
                    if (section) matches.push({ text: h.textContent, url: `#${section}` });
                }
            });
            // render
            searchResults.innerHTML = matches.length
                ? `<ul>${matches.map(m => `<li><a href="${m.url}">${m.text}</a></li>`).join('') }</ul>`
                : `<p style="padding:8px">No results</p>`;
            searchResults.style.display = 'block';
        }, 200);
    });

    // on Enter or button-click
    const doSearch = () => {
        const q = searchInput.value.trim().toLowerCase();
        if (q.length < 2) return;
        const firstSection = document.querySelector(`.wiki-section[id*="${q}"]`);
        if (firstSection) {
            window.location.hash = firstSection.id;
        } else {
            alert(`No results found for: ${searchInput.value}`);
        }
        searchResults.style.display = 'none';
    };
    searchButton.addEventListener('click', doSearch);
    searchInput.closest('form')?.addEventListener('submit', e => { e.preventDefault(); doSearch(); });

    // hide when clicking outside
    document.addEventListener('click', e => {
        if (!searchBox.contains(e.target)) searchResults.style.display = 'none';
    });
}


/**
 * FAQ Accordion functionality
 */
function initializeFAQAccordion() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');

        // Initialize ARIA
        item.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', answer.id || '');
        question.setAttribute('aria-expanded', 'false');

        question.addEventListener('click', function() {
            const isExpanded = item.getAttribute('aria-expanded') === 'true';

            // Toggle ARIA on the item and the question
            item.setAttribute('aria-expanded', String(!isExpanded));
            question.setAttribute('aria-expanded', String(!isExpanded));

            // Directly manage the answer's max-height for smooth transition
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
}

/**
 * ScrollSpy functionality
 * - Highlights current section in navigation
 */
function initializeScrollSpy() {
    const sections = document.querySelectorAll('.wiki-section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                navLink?.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, null, this.getAttribute('href'));
        });
    });
}

/**
 * Responsive UI adjustments
 */
function initializeResponsiveUI() {
    document.querySelectorAll('table').forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

    document.querySelectorAll('img').forEach(img => {
        img.classList.add('img-fluid');
        img.setAttribute('alt', img.getAttribute('alt') || ''); // ensure alt exists
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            document.querySelector('.sidebar')?.classList.remove('active');
            document.querySelector('.mobile-nav-toggle i')?.classList.replace('fa-times','fa-bars');
        }
    });
}

/**
 * Back to top button functionality
 */
function initializeBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Syntax highlighting
 */
function initializeSyntaxHighlighting() {
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
}

/**
 * Print support
 */
function initializePrintSupport() {
    const header = document.querySelector('.header');
    if (!header) return;

    const actions = document.createElement('div');
    actions.className = 'header-actions';
    header.appendChild(actions);

    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print';
    printButton.setAttribute('aria-label', 'Print page');
    actions.appendChild(printButton);

    printButton.addEventListener('click', () => window.print());

    const printStyle = document.createElement('style');
    printStyle.media = 'print';
    printStyle.textContent = `
        .sidebar, .mobile-nav-toggle, .back-to-top, .header-actions { display: none !important; }
        .content { margin: 0 !important; width: 100% !important; }
        .wiki-section { break-inside: avoid; }
        a[href]:after { content: ' (' attr(href) ')'; font-size: 0.8em; }
    `;
    document.head.appendChild(printStyle);
}

/**
 * Theme switching functionality
 */
function initializeThemeSwitcher() {
  const btnIconSun  = '<i class="fas fa-sun"></i>';
  const btnIconMoon = '<i class="fas fa-moon"></i>';

  // 1) Grab or create the switcher button
  let themeSwitcher = document.querySelector('.theme-switcher');
  if (!themeSwitcher) {
    const headerActions = document.querySelector('.header-actions') ||
                          document.querySelector('.header').appendChild(document.createElement('div'));
    themeSwitcher = document.createElement('button');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.setAttribute('aria-label', 'Toggle dark mode');
    headerActions.prepend(themeSwitcher);
  }

  // 2) Determine initial theme (localStorage > system preference > light)
  const stored = localStorage.getItem('shanios-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (systemDark ? 'dark' : 'light');

  // 3) Apply it
  document.documentElement.setAttribute('data-theme', initial);
  themeSwitcher.innerHTML = initial === 'dark' ? btnIconSun : btnIconMoon;

  // 4) Listen for clicks
  themeSwitcher.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('shanios-theme', next);
    themeSwitcher.innerHTML = next === 'dark' ? btnIconSun : btnIconMoon;
  });
}


