  // Progress bar
  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    document.getElementById('prog').style.width = pct + '%';
  });

  // Intersection observer for fade-in
  const io = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.07 }
  );
  document.querySelectorAll('.section').forEach(s => io.observe(s));

  // Sidebar highlight
  const slinks = document.querySelectorAll('.sb-link');
  function setActive(id) {
    slinks.forEach(l => l.classList.remove('active'));
    const el = document.querySelector(`.sb-link[onclick*="${id}"]`);
    if (el) el.classList.add('active');
  }

  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { threshold: 0.4 });
  document.querySelectorAll('.section').forEach(s => sio.observe(s));

  // Scroll to section
  function goTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Tab switching
  function swTab(el, targetId) {
    const parent = el.parentElement;
    const section = parent.parentElement;
    parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const tp = document.getElementById(targetId);
    if (tp) tp.classList.add('active');
  }

  // Copy button
  function copyT(btn) {
    const body = btn.closest('.terminal').querySelector('.tbody');
    const lines = [...body.querySelectorAll('.line')];
    const text = lines.map(l => {
      const p = l.querySelector('.prompt');
      const c = l.querySelector('.cmd');
      if (p && c) return '$ ' + c.textContent;
      return [...l.querySelectorAll('span')].map(s => s.textContent).join('');
    }).filter(Boolean).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ copied';
      btn.style.color = 'var(--green)';
      setTimeout(() => { btn.textContent = 'copy'; btn.style.color = ''; }, 2200);
    });
  }

  // Quiz
  function ans(btn, correct, qid) {
    const quiz = document.getElementById(qid);
    if (quiz.dataset.done) return;
    quiz.dataset.done = '1';
    quiz.querySelectorAll('.quiz-opt').forEach(o => o.disabled = true);
    const res = document.getElementById(qid + '-res');
    if (correct) {
      btn.classList.add('correct');
      res.textContent = '✅ Correct! You know your advanced Git.';
      res.className = 'quiz-res show ok';
    } else {
      btn.classList.add('wrong');
      res.textContent = '❌ Not quite. Review the section above.';
      res.className = 'quiz-res show fail';
    }
  }
