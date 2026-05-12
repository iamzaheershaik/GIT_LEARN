// ── JavaScript Masterclass — Interactivity ──

// Copy code block
function copyBlock(btn) {
  const body = btn.closest('.terminal').querySelector('.terminal-body');
  const lines = body.querySelectorAll('.line');
  let text = '';
  lines.forEach(l => {
    const raw = l.textContent;
    text += raw + '\n';
  });
  navigator.clipboard.writeText(text.trim()).then(() => {
    btn.textContent = 'copied!';
    btn.style.color = '#34d399';
    btn.style.borderColor = '#34d399';
    setTimeout(() => {
      btn.textContent = 'copy';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 1500);
  });
}

// Tab switching
function switchTab(tabEl, contentId) {
  const parent = tabEl.closest('.section') || tabEl.closest('.content') || document.body;
  const tabGroup = tabEl.parentElement;

  // Deactivate all tabs in this group
  tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');

  // Find sibling tab contents
  let sibling = tabGroup.nextElementSibling;
  while (sibling && sibling.classList.contains('tab-content')) {
    sibling.classList.remove('active');
    sibling = sibling.nextElementSibling;
  }

  const target = document.getElementById(contentId);
  if (target) target.classList.add('active');
}

// Smooth scroll for sidebar links
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  // Close sidebar on mobile
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 900 && sidebar) {
    sidebar.classList.remove('open');
  }
}

// Progress bar
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const bar = document.getElementById('progress');
  if (bar) bar.style.width = progress + '%';
}

// Sidebar active tracking
function updateSidebar() {
  const sections = document.querySelectorAll('.section, .hero');
  const links = document.querySelectorAll('.sidebar-link');
  let current = '';

  sections.forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top <= 120) {
      current = s.id;
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    const onclick = link.getAttribute('onclick');
    if (onclick && onclick.includes(`'${current}'`)) {
      link.classList.add('active');
    }
  });
}

// Section reveal on scroll (IntersectionObserver)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section').forEach(s => observer.observe(s));

// Scroll events
window.addEventListener('scroll', () => {
  updateProgress();
  updateSidebar();
}, { passive: true });

// Mobile sidebar toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== sidebarToggle) {
      sidebar.classList.remove('open');
    }
  });
}

// Initial calls
updateProgress();
