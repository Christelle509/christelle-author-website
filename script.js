// =============================================================
// script.js — Christelle Fabie Joseph — Site Auteure
// Handles: dark/light mode, mobile menu, smooth scroll,
//          comment form submission
// =============================================================


// ---------------------------------------------------------------
// SECTION 1: DARK / LIGHT MODE TOGGLE
// Persists the user's choice in localStorage.
// Applies the "dark" class to <html> for CSS variable switching.
// ---------------------------------------------------------------

const themeToggle       = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const themeIcon         = document.getElementById('themeIcon');
const themeIconMobile   = document.getElementById('themeIconMobile');

// Read saved preference — default to dark if nothing is saved
function getStoredTheme() {
  return localStorage.getItem('theme') || 'dark';
}

// Apply the correct class and icon for the current theme
function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    // Show sun icon (clicking switches to light)
    if (themeIcon)       { themeIcon.className       = 'fa-solid fa-sun'; }
    if (themeIconMobile) { themeIconMobile.className  = 'fa-solid fa-sun'; }
  } else {
    html.classList.remove('dark');
    // Show moon icon (clicking switches to dark)
    if (themeIcon)       { themeIcon.className       = 'fa-solid fa-moon'; }
    if (themeIconMobile) { themeIconMobile.className  = 'fa-solid fa-moon'; }
  }
}

// Toggle between dark and light, then save
function toggleTheme() {
  const current = getStoredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
}

// Attach click handlers to both toggle buttons
if (themeToggle)       themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

// Apply the saved theme on page load
applyTheme(getStoredTheme());


// ---------------------------------------------------------------
// SECTION 2: MOBILE MENU TOGGLE
// Opens and closes the mobile navigation dropdown.
// ---------------------------------------------------------------

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon   = document.getElementById('menuIcon');

let menuOpen = false;

function openMenu() {
  menuOpen = true;
  mobileMenu.classList.add('open');
  menuIcon.className = 'fa-solid fa-xmark';
  menuToggle.setAttribute('aria-label', 'Fermer le menu');
}

function closeMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  menuIcon.className = 'fa-solid fa-bars';
  menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
}

if (menuToggle) {
  menuToggle.addEventListener('click', function () {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}


// ---------------------------------------------------------------
// SECTION 3: SMOOTH SCROLL
// Scrolls to a section by its id, with offset for the fixed navbar.
// Also closes the mobile menu when a nav link is clicked.
// ---------------------------------------------------------------

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  // Close mobile menu when navigating
  closeMenu();

  // Offset for the fixed navbar height (80px)
  const navbarHeight = 80;
  const top = element.getBoundingClientRect().top + window.scrollY - navbarHeight;

  window.scrollTo({ top: top, behavior: 'smooth' });
}
// ---------------------------------------------------------------
// SECTION 4: COMMENT FORM SUBMISSION TO WHATSAPP
// Opens WhatsApp with the reader's comment prepared.
// ---------------------------------------------------------------

const commentForm = document.getElementById('commentForm');

if (commentForm) {
  commentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('commenterName');
    const bookSelect = document.getElementById('bookSelect');
    const commentInput = document.getElementById('commentText');

    const name = nameInput.value.trim();
    const book = bookSelect.value || 'General message';
    const comment = commentInput.value.trim();

    if (!name || !comment) {
      alert('Please enter your name and your comment.');
      return;
    }

    const plainMessage =
      `Hello Christelle, I want to leave a reader comment.\n\n` +
      `Name: ${name}\n` +
      `Book: ${book}\n` +
      `Comment: ${comment}`;

    const whatsappNumber = '50937956024';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(plainMessage)}`;

    window.open(whatsappUrl, '_blank');

    nameInput.value = '';
    bookSelect.value = '';
    commentInput.value = '';
  });
}
// ---------------------------------------------------------------
// SECTION 5: UTILITY — HTML ESCAPE
// Prevents XSS by escaping user-submitted text before inserting
// it into the DOM via innerHTML.
// ---------------------------------------------------------------

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
