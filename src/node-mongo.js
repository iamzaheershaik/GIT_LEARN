// Toggle Q&A
function toggleQA(card) {
  card.classList.toggle('open');
}

// Toggle Section
function toggleSection(header) {
  const body = header.nextElementSibling;
  header.classList.toggle('collapsed');
  if (body && body.classList.contains('qa-list')) {
    body.style.display = body.style.display === 'none' ? 'flex' : 'none';
    body.style.flexDirection = 'column';
    body.style.gap = '2px';
  }
}

// Search
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', function() {
  const val = this.value.toLowerCase().trim();
  document.querySelectorAll('.qa-card').forEach(card => {
    const q = (card.dataset.q || '').toLowerCase();
    const text = card.textContent.toLowerCase();
    card.classList.toggle('hidden', val !== '' && !q.includes(val) && !text.includes(val));
  });
});

// Progress bar
const progressBar = document.getElementById('progress-bar');
const floatSection = document.getElementById('float-section');
const floatFill = document.getElementById('float-fill');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = Math.min(100, (scrollTop / docHeight) * 100);
  progressBar.style.width = pct + '%';
  floatFill.style.width = pct + '%';
});

// Active nav item
const sections = document.querySelectorAll('[id^="s"], #cheat');
const navItems = document.querySelectorAll('.nav-item');

const sectionLabels = {
  s1: 'Fundamentals', s2: 'Async Patterns', s3: 'Modules & npm',
  s4: 'HTTP & Networking', s5: 'Security & Perf', s6: 'Advanced',
  s7: 'MongoDB Basics', s8: 'Mongoose', s9: 'Express Basics',
  s10: 'Advanced Express', cheat: 'Cheat Sheet'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(ni => ni.classList.remove('active'));
      const activeNav = document.querySelector(`.nav-item[href="#${id}"]`);
      if (activeNav) activeNav.classList.add('active');
      floatSection.textContent = sectionLabels[id] || id;
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

// Stagger card animations
document.querySelectorAll('.qa-list').forEach(list => {
  list.querySelectorAll('.qa-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 30}ms`;
  });
});
