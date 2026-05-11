// ── Git Masterclass — Level Switcher Logic ──

let currentLevel = 1;

const frames = {
  1: { el: document.getElementById('frame1'), src: 'html/git-masterclass.html', loaded: true },
  2: { el: document.getElementById('frame2'), src: 'html/git-masterclass-level2.html', loaded: false },
  3: { el: document.getElementById('frame3'), src: 'html/git-masterclass-level3.html', loaded: false },
};

const btns = {
  1: document.getElementById('lvlBtn1'),
  2: document.getElementById('lvlBtn2'),
  3: document.getElementById('lvlBtn3'),
};

const overlay = document.getElementById('transOverlay');
const loader = document.getElementById('loader');

function switchLevel(level) {
  if (level === currentLevel) return;

  const prevLevel = currentLevel;
  currentLevel = level;

  // Update body class
  document.body.className = `level-${level}`;

  // Update button states
  Object.values(btns).forEach(b => b.classList.remove('active'));
  btns[level].classList.add('active');

  // Show transition overlay
  overlay.classList.add('active');

  // Lazy-load iframe if not loaded
  const frame = frames[level];
  if (!frame.loaded) {
    loader.classList.add('show');
    frame.el.src = frame.src;
    frame.el.addEventListener('load', () => {
      frame.loaded = true;
      loader.classList.remove('show');
      completeTransition(prevLevel, level);
    }, { once: true });
  } else {
    setTimeout(() => completeTransition(prevLevel, level), 80);
  }

  // Save to localStorage
  try { localStorage.setItem('git-masterclass-level', level); } catch(e) {}
}

function completeTransition(prevLevel, newLevel) {
  // Hide previous frame
  frames[prevLevel].el.classList.remove('active');

  // Show new frame
  frames[newLevel].el.classList.add('active');

  // Remove overlay
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 120);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ignore if user is typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === '1') switchLevel(1);
  else if (e.key === '2') switchLevel(2);
  else if (e.key === '3') switchLevel(3);
  else if (e.key === 'ArrowLeft' && currentLevel > 1) switchLevel(currentLevel - 1);
  else if (e.key === 'ArrowRight' && currentLevel < 3) switchLevel(currentLevel + 1);
});

// Restore last level from localStorage
try {
  const saved = localStorage.getItem('git-masterclass-level');
  if (saved && [1, 2, 3].includes(Number(saved))) {
    const savedLevel = Number(saved);
    if (savedLevel !== 1) {
      // Need to switch after initial frame loads
      frames[1].el.addEventListener('load', () => {
        switchLevel(savedLevel);
      }, { once: true });
    }
  }
} catch(e) {}
