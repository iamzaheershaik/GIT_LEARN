  // ── SCROLL PROGRESS ──
  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    document.getElementById('progress').style.width = pct + '%';
  });

  // ── INTERSECTION OBSERVER (fade in sections) ──
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section').forEach(s => io.observe(s));

  // ── SIDEBAR ACTIVE ──
  const sections = document.querySelectorAll('.section, .hero');
  const links = document.querySelectorAll('.sidebar-link');

  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.remove('active'));
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sio.observe(s));

  // ── TABS ──
  function switchTab(el, targetId) {
    const parent = el.closest('.section') || el.parentElement.parentElement;
    parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    parent.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');
  }

  // ── COPY BUTTON ──
  function copyBlock(btn) {
    const body = btn.closest('.terminal').querySelector('.terminal-body');
    const lines = [...body.querySelectorAll('.line')];
    const text = lines.map(l => {
      const prompt = l.querySelector('.prompt');
      const cmd = l.querySelector('.cmd');
      const out = l.querySelector('.out, .out-green, .out-red, .out-amber, .out-cyan, .out-purple, .comment');
      if (prompt && cmd) return '$ ' + cmd.textContent;
      if (out) return out.textContent;
      return l.textContent;
    }).filter(Boolean).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ copied';
      btn.style.color = 'var(--green)';
      setTimeout(() => { btn.textContent = 'copy'; btn.style.color = ''; }, 2000);
    });
  }

  // ── SMOOTH SCROLL ──
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    links.forEach(l => l.classList.remove('active'));
  }

  // ── QUIZ ──
  function answer(btn, correct, qid) {
    const quiz = document.getElementById(qid);
    if (quiz.dataset.answered) return;
    quiz.dataset.answered = '1';
    const opts = quiz.querySelectorAll('.quiz-opt');
    opts.forEach(o => o.disabled = true);
    const result = document.getElementById(qid + '-result');
    if (correct) {
      btn.classList.add('correct');
      result.textContent = '✅ Correct! Well done.';
      result.className = 'quiz-result show ok';
    } else {
      btn.classList.add('wrong');
      opts.forEach(o => { if (o !== btn) { /* find correct */ } });
      result.textContent = '❌ Not quite. Review the relevant section above.';
      result.className = 'quiz-result show fail';
    }
  }
