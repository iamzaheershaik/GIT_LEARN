// ── Dev Hub — Section & Level Switcher Logic ──

let currentLevel = 1;
let currentSection = 'git';

// Git level frames
const frames = {
  1: { el: document.getElementById('frame1'), src: 'html/git-masterclass.html', loaded: true },
  2: { el: document.getElementById('frame2'), src: 'html/git-masterclass-level2.html', loaded: false },
  3: { el: document.getElementById('frame3'), src: 'html/git-masterclass-level3.html', loaded: false },
};

// Section frames
const sectionFrames = {
  crackjs: { el: document.getElementById('frameCrackjs'), src: 'https://crack-the-js.vercel.app', loaded: true },
};

const btns = {
  1: document.getElementById('lvlBtn1'),
  2: document.getElementById('lvlBtn2'),
  3: document.getElementById('lvlBtn3'),
};

const sectionBtns = {
  git: document.getElementById('secBtnGit'),
  crackjs: document.getElementById('secBtnCrackjs'),
};

const overlay = document.getElementById('transOverlay');
const loader = document.getElementById('loader');
const levelSwitcher = document.getElementById('levelSwitcher');
const navHint = document.getElementById('navHint');

// ── Section Switching ──
function switchSection(section) {
  if (section === currentSection) return;

  const prevSection = currentSection;
  currentSection = section;

  // Update section button states
  Object.values(sectionBtns).forEach(b => b.classList.remove('active'));
  sectionBtns[section].classList.add('active');

  // Show/hide level switcher (only for git section)
  if (section === 'git') {
    levelSwitcher.style.display = '';
    navHint.style.display = '';
  } else {
    levelSwitcher.style.display = 'none';
    navHint.style.display = 'none';
  }

  // Update body class for theming
  if (section === 'git') {
    document.body.className = `level-${currentLevel}`;
  } else if (section === 'crackjs') {
    document.body.className = 'section-crackjs';
  }

  // Show transition overlay
  overlay.classList.add('active');

  // Hide ALL frames first
  hideAllFrames();

  if (section === 'git') {
    // Show current git level frame
    setTimeout(() => {
      frames[currentLevel].el.classList.add('active');
      overlay.classList.remove('active');
    }, 100);
  } else {
    // Show section frame
    const sf = sectionFrames[section];
    if (!sf.loaded) {
      loader.classList.add('show');
      sf.el.src = sf.src;
      sf.el.addEventListener('load', () => {
        sf.loaded = true;
        loader.classList.remove('show');
        sf.el.classList.add('active');
        overlay.classList.remove('active');
      }, { once: true });
    } else {
      setTimeout(() => {
        sf.el.classList.add('active');
        overlay.classList.remove('active');
      }, 100);
    }
  }

  // Save to localStorage
  try { localStorage.setItem('dev-hub-section', section); } catch(e) {}
}

function hideAllFrames() {
  // Hide git frames
  Object.values(frames).forEach(f => f.el.classList.remove('active'));
  // Hide section frames
  Object.values(sectionFrames).forEach(f => f.el.classList.remove('active'));
}

// ── Level Switching (Git Masterclass only) ──
function switchLevel(level) {
  if (level === currentLevel && currentSection === 'git') return;

  // If not in git section, switch to it first
  if (currentSection !== 'git') {
    currentLevel = level;
    switchSection('git');
    Object.values(btns).forEach(b => b.classList.remove('active'));
    btns[level].classList.add('active');
    return;
  }

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

  if (currentSection === 'git') {
    if (e.key === '1') switchLevel(1);
    else if (e.key === '2') switchLevel(2);
    else if (e.key === '3') switchLevel(3);
    else if (e.key === 'ArrowLeft' && currentLevel > 1) switchLevel(currentLevel - 1);
    else if (e.key === 'ArrowRight' && currentLevel < 3) switchLevel(currentLevel + 1);
  }
});

// Restore last state from localStorage
try {
  const savedSection = localStorage.getItem('dev-hub-section');
  const savedLevel = localStorage.getItem('git-masterclass-level');

  if (savedLevel && [1, 2, 3].includes(Number(savedLevel))) {
    currentLevel = Number(savedLevel);
    Object.values(btns).forEach(b => b.classList.remove('active'));
    btns[currentLevel].classList.add('active');
  }

  if (savedSection && ['git', 'crackjs'].includes(savedSection)) {
    if (savedSection !== 'git') {
      frames[1].el.addEventListener('load', () => {
        switchSection(savedSection);
      }, { once: true });
    } else if (currentLevel !== 1) {
      frames[1].el.addEventListener('load', () => {
        switchLevel(currentLevel);
      }, { once: true });
    }
  } else if (currentLevel !== 1) {
    frames[1].el.addEventListener('load', () => {
      switchLevel(currentLevel);
    }, { once: true });
  }
} catch(e) {}
