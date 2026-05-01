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
// SECTION 4: COMMENT FORM SUBMISSION
// Validates required fields, adds the comment to the page,
// clears the form, and shows a success message.
// ---------------------------------------------------------------

const commentForm  = document.getElementById('commentForm');
const formSuccess  = document.getElementById('formSuccess');
const commentsList = document.getElementById('commentsList');

// Track whether we have already added the "recent comments" heading
let commentsHeadingAdded = false;

if (commentForm) {
  commentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameInput    = document.getElementById('commenterName');
    const bookSelect   = document.getElementById('bookSelect');
    const commentInput = document.getElementById('commentText');

    const name    = nameInput.value.trim();
    const book    = bookSelect.value;
    const comment = commentInput.value.trim();

    // Validate required fields (name + comment)
    if (!name || !comment) {
      nameInput.style.borderColor    = name    ? '' : '#e74c3c';
      commentInput.style.borderColor = comment ? '' : '#e74c3c';
      return;
    }

    // Reset any error borders
    nameInput.style.borderColor    = '';
    commentInput.style.borderColor = '';

    // Format the current date in French
    const date = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Add "Récents commentaires" heading only once
    if (!commentsHeadingAdded) {
      const heading = document.createElement('h3');
      heading.className = 'comments-heading';
      heading.textContent = 'Récents commentaires';
      commentsList.prepend(heading);
      commentsHeadingAdded = true;
    }

    // Build the new comment card HTML
    const commentEl = document.createElement('div');
    commentEl.className = 'comment-item';
    commentEl.innerHTML = `
      <div class="comment-meta">
        <div>
          <div class="comment-author">${escapeHtml(name)}</div>
          ${book ? `<div class="comment-book">${escapeHtml(book)}</div>` : ''}
        </div>
        <span class="comment-date">${date}</span>
      </div>
      <p class="comment-text">"${escapeHtml(comment)}"</p>
    `;

    // Insert new comment at the top (after the heading)
    const heading = commentsList.querySelector('.comments-heading');
    if (heading) {
      heading.insertAdjacentElement('afterend', commentEl);
    } else {
      commentsList.prepend(commentEl);
    }

    // Clear the form fields
    nameInput.value    = '';
    bookSelect.value   = '';
    commentInput.value = '';

    // Show the success message, then hide it after 4 seconds
    formSuccess.classList.add('visible');
    setTimeout(function () {
      formSuccess.classList.remove('visible');
    }, 4000);
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
