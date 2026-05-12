function setActive(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}

function copyCode(btn) {
  const pre = btn.closest('.code-wrap').querySelector('pre');
  const text = pre.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// Progress bar
window.addEventListener('scroll', () => {
  const el = document.documentElement;
  const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight) * 100;
  document.getElementById('progress').style.width = scrolled + '%';
});

// Scrollspy
const sections = document.querySelectorAll('.section[id]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });
sections.forEach(s => observer.observe(s));

// Search filter
document.getElementById('search-input').addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('.nav-link').forEach(link => {
    const text = link.textContent.toLowerCase();
    link.style.display = q === '' || text.includes(q) ? '' : 'none';
  });
});
