// ── Toggle card open/close ──
function toggleCard(header) {
    const card = header.parentElement;
    card.classList.toggle('open');
}

// ── Tab switching ──
function switchTab(btn, lang, qid) {
    const body = btn.closest('.q-body');
    const tabs = body.querySelectorAll('.lang-tab');
    const panes = body.querySelectorAll('.lang-pane');
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const pane = document.getElementById(`${qid}-${lang}`);
    if (pane) pane.classList.add('active');
}

// ── Copy code ──
function copyCode(btn) {
    const pre = btn.nextElementSibling;
    const text = pre.innerText || pre.textContent;
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// ── Active nav on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const a = document.querySelector(`nav a[href="#${e.target.id}"]`);
            if (a) a.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => io.observe(s));
