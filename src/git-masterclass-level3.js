  // Progress
  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    document.getElementById('prog').style.width =
      (el.scrollTop / (el.scrollHeight - el.clientHeight) * 100) + '%';
  });

  // Fade-in sections
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
    { threshold: 0.07 }
  );
  document.querySelectorAll('.sec').forEach(s => io.observe(s));

  // Sidebar
  const sas = document.querySelectorAll('.sb-a');
  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        sas.forEach(a => a.classList.remove('on'));
        const a = document.querySelector(`.sb-a[onclick*="${e.target.id}"]`);
        if (a) a.classList.add('on');
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.sec').forEach(s => sio.observe(s));

  function go(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Tabs
  function swTab(el, id) {
    const parent = el.parentElement;
    const sec = parent.parentElement;
    parent.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
    el.classList.add('on');
    sec.querySelectorAll('.pane').forEach(p => p.classList.remove('on'));
    const p = document.getElementById(id);
    if (p) p.classList.add('on');
  }

  // Copy
  function cp(btn) {
    const body = btn.closest('.term').querySelector('.tbody');
    const text = [...body.querySelectorAll('.L')].map(l => {
      const pr = l.querySelector('.pr');
      const c = l.querySelector('.c');
      if (pr && c) return '$ ' + c.textContent;
      return [...l.querySelectorAll('span')].map(s => s.textContent).join('');
    }).filter(Boolean).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ copied';
      btn.style.color = 'var(--green)';
      setTimeout(() => { btn.textContent = 'copy'; btn.style.color = ''; }, 2200);
    });
  }

  // Quiz
  function qans(btn, correct, qid) {
    const quiz = document.getElementById(qid);
    if (quiz.dataset.done) return;
    quiz.dataset.done = '1';
    quiz.querySelectorAll('.qopt').forEach(o => o.disabled = true);
    const res = document.getElementById(qid + '-res');
    btn.classList.add(correct ? 'ok' : 'no');
    res.textContent = correct ? '✅ Correct! Expert-level thinking.' : '❌ Not quite — review the section above.';
    res.className = 'qres show ' + (correct ? 'yes' : 'nope');
  }
