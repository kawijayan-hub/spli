/* =========================================================
   SPLI Website - Multi-Page Vanilla JS
   Shared script for all pages.
   ========================================================= */

/* ── Contact Data (Edit Here) ──────────────────────── */
const CONTACT_DATA = {
  company: 'PT. Sarana Pamunah Limbah Indonesia',
  year: new Date().getFullYear()
};

/* ── Year injection ────────────────────────────────── */
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = CONTACT_DATA.year;
});

/* ── Mobile Nav Toggle ─────────────────────────────── */
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const navDropdowns = document.querySelectorAll('[data-nav-dropdown]');

function closeNavDropdowns() {
  navDropdowns.forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    const toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    if (!isOpen) closeNavDropdowns();
  });

  nav.querySelectorAll('[data-nav-dropdown-toggle]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const dropdown = button.closest('[data-nav-dropdown]');
      if (!dropdown) return;

      navDropdowns.forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove('is-open');
          const itemToggle = item.querySelector('[data-nav-dropdown-toggle]');
          if (itemToggle) itemToggle.setAttribute('aria-expanded', 'false');
        }
      });

      const isOpen = dropdown.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      closeNavDropdowns();
    });
  });
}

document.addEventListener('click', (event) => {
  const clickedInsideNav = event.target.closest('[data-nav]');
  const clickedToggle = event.target.closest('[data-nav-toggle]');
  if (!clickedInsideNav && !clickedToggle) closeNavDropdowns();
});

/* ── Header Scroll Effect ──────────────────────────── */
const header = document.querySelector('[data-header]');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

/* ── Active Nav Link Detection ─────────────────────── */
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop().split('#')[0] || 'index.html';
    if (linkPage === currentPage) {
      link.classList.add('active');
      const parentDropdown = link.closest('[data-nav-dropdown]');
      if (parentDropdown) parentDropdown.classList.add('is-active');
    }
  });
})();

/* ── Scroll Reveal (IntersectionObserver) ──────────── */
const revealItems = document.querySelectorAll('.reveal, .stagger-children');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealItems.forEach((item) => revealObserver.observe(item));

/* ── Cursor Glow ───────────────────────────────────── */
const glow = document.querySelector('.cursor-glow');
if (glow) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

/* ── FAQ Accordion ─────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;

    // Close other open items in the same list
    const parent = item.closest('.faq-list');
    if (parent) {
      parent.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
        }
      });
    }

    item.classList.toggle('is-open');
  });
});

/* ── Counter Animation ─────────────────────────────── */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = prefix + current.toLocaleString('id-ID') + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          }
        }

        requestAnimationFrame(updateCount);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

animateCounters();

/* ── Contact Form Handling ─────────────────────────── */
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
      } else {
        field.style.borderColor = '';
      }
    });

    // Email validation
    const emailField = contactForm.querySelector('[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = '#ef4444';
      }
    }

    if (isValid) {
      // Show success message
      const successMsg = contactForm.querySelector('.form-success');
      if (successMsg) {
        successMsg.classList.add('is-visible');
        setTimeout(() => {
          successMsg.classList.remove('is-visible');
        }, 4000);
      }
      contactForm.reset();
    }
  });

  // Clear error styling on input
  contactForm.querySelectorAll('.form-input, .form-textarea').forEach((field) => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

/* ── Smooth Scroll for Anchor Links ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
