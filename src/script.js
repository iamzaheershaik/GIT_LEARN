// ── Dev Hub — Sidebar & Level Switcher Logic ──

let currentLevel = 1;
let currentSection = 'home';

// Git level frames
const frames = {
  1: { el: document.getElementById('frame1'), src: 'html/git-masterclass.html', loaded: true },
  2: { el: document.getElementById('frame2'), src: 'html/git-masterclass-level2.html', loaded: false },
  3: { el: document.getElementById('frame3'), src: 'html/git-masterclass-level3.html', loaded: false },
};

// Section frames (Dashboard does not have an iframe)
const sectionFrames = {
  js: { el: document.getElementById('frameJs'), src: 'html/js-masterclass.html', loaded: false },
  html5: { el: document.getElementById('frameHtml5'), src: 'html/html5-notes.html', loaded: false },
  networking: { el: document.getElementById('frameNetworking'), src: 'html/networking-notes.html', loaded: false },
  react: { el: document.getElementById('frameReact'), src: 'https://crack-the-js.vercel.app', loaded: true },
  logic: { el: document.getElementById('frameLogic'), src: 'html/interview-logic-questions.html', loaded: false },
  sql: { el: document.getElementById('frameSql'), src: 'html/SQL_Complete_Learning_Roadmap.html', loaded: false },
  postgres: { el: document.getElementById('framePostgres'), src: 'html/postgresql-learning-series-enhanced.html', loaded: false },
  node: { el: document.getElementById('frameNode'), src: 'html/node-mongo-express-interview.html', loaded: false },
  jsDeep: { el: document.getElementById('frameJsDeep'), src: 'html/js-interview-deep.html', loaded: true },
};

const btns = {
  1: document.getElementById('lvlBtn1'),
  2: document.getElementById('lvlBtn2'),
  3: document.getElementById('lvlBtn3'),
};

const sectionBtns = {
  home: document.getElementById('secBtnHome'),
  git: document.getElementById('secBtnGit'),
  js: document.getElementById('secBtnJs'),
  html5: document.getElementById('secBtnHtml5'),
  networking: document.getElementById('secBtnNetworking'),
  react: document.getElementById('secBtnReact'),
  logic: document.getElementById('secBtnLogic'),
  sql: document.getElementById('secBtnSql'),
  postgres: document.getElementById('secBtnPostgres'),
  node: document.getElementById('secBtnNode'),
  jsDeep: document.getElementById('secBtnJsDeep'),
};

const overlay = document.getElementById('transOverlay');
const loader = document.getElementById('loader');
const levelSwitcher = document.getElementById('levelSwitcher');
const dashboardView = document.getElementById('dashboardView');
const breadcrumb = document.getElementById('breadcrumb');

const sectionTitles = {
  home: '<span class="bc-icon">🏠</span> Dashboard',
  git: '<span class="bc-icon">⌥</span> Git Masterclass',
  js: '<span class="bc-icon">⚡</span> JS Masterclass',
  html5: '<span class="bc-icon">🌐</span> HTML5 Notes',
  networking: '<span class="bc-icon">📡</span> Networking',
  react: '<span class="bc-icon">⚛️</span> React Q/A',
  logic: '<span class="bc-icon">🧠</span> Interview Logic',
  sql: '<span class="bc-icon">🗄️</span> SQL Roadmap',
  postgres: '<span class="bc-icon">🐘</span> PostgreSQL',
  node: '<span class="bc-icon">🟢</span> Node / Mongo',
  jsDeep: '<span class="bc-icon">📘</span> JS Deep Guide'
};

// ── Section Switching ──
function switchSection(section) {
  if (section === currentSection) return;

  currentSection = section;

  // Close mobile sidebar if it's open
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');

  // Update section button states
  Object.values(sectionBtns).forEach(b => { if(b) b.classList.remove('active'); });
  if (sectionBtns[section]) sectionBtns[section].classList.add('active');

  // Breadcrumb
  if (breadcrumb) {
    breadcrumb.innerHTML = sectionTitles[section] || section;
  }

  // Show/hide level switcher (only for git section)
  if (section === 'git') {
    levelSwitcher.style.display = 'flex';
  } else {
    levelSwitcher.style.display = 'none';
  }

  // Update body class for theming
  if (section === 'git') {
    document.body.className = `level-${currentLevel}`;
  } else {
    document.body.className = `section-${section}`;
  }

  // Show transition overlay
  overlay.classList.add('active');

  // Hide ALL frames and dashboard
  hideAllFrames();
  dashboardView.classList.remove('active');

  if (section === 'home') {
    setTimeout(() => {
      dashboardView.classList.add('active');
      overlay.classList.remove('active');
    }, 150);
  } else if (section === 'git') {
    setTimeout(() => {
      frames[currentLevel].el.classList.add('active');
      overlay.classList.remove('active');
    }, 150);
  } else {
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
      }, 150);
    }
  }

  try {
    localStorage.setItem('dev-hub-section', section);
    if (section !== 'home') {
      let visited = JSON.parse(localStorage.getItem('dev-hub-visited') || '[]');
      if (!visited.includes(section)) {
        visited.push(section);
        localStorage.setItem('dev-hub-visited', JSON.stringify(visited));
        const prog = document.getElementById('prog-' + section);
        if (prog) prog.style.width = '100%';
      }
    }
  } catch(e) {}
}

function switchLevel(level) {
  if (level === currentLevel) return;

  currentLevel = level;
  
  Object.values(btns).forEach(b => b.classList.remove('active'));
  btns[level].classList.add('active');
  
  document.body.className = `level-${level}`;
  
  overlay.classList.add('active');
  
  setTimeout(() => {
    hideAllFrames();
    dashboardView.classList.remove('active');
    
    if (!frames[level].loaded) {
      loader.classList.add('show');
      frames[level].el.src = frames[level].src;
      frames[level].el.addEventListener('load', () => {
        frames[level].loaded = true;
        loader.classList.remove('show');
        frames[level].el.classList.add('active');
        overlay.classList.remove('active');
      }, { once: true });
    } else {
      frames[level].el.classList.add('active');
      overlay.classList.remove('active');
    }
    
    try {
      localStorage.setItem('git-masterclass-level', level);
    } catch(e) {}
  }, 150);
}

function hideAllFrames() {
  Object.values(frames).forEach(f => f.el.classList.remove('active'));
  Object.values(sectionFrames).forEach(f => f.el.classList.remove('active'));
}

// ── Keyboard Shortcuts ──
document.addEventListener('keydown', (e) => {
  if (currentSection !== 'git') return;
  if (['1', '2', '3'].includes(e.key)) {
    switchLevel(Number(e.key));
  }
});

// ── Initialization ──
try {
  const savedSection = localStorage.getItem('dev-hub-section');
  const savedLevel = localStorage.getItem('git-masterclass-level');

  if (savedLevel && [1, 2, 3].includes(Number(savedLevel))) {
    currentLevel = Number(savedLevel);
    Object.values(btns).forEach(b => b.classList.remove('active'));
    btns[currentLevel].classList.add('active');
  }

  if (savedSection && Object.keys(sectionBtns).includes(savedSection)) {
    if (savedSection !== 'git' && savedSection !== 'home') {
      frames[1].el.addEventListener('load', () => {
        switchSection(savedSection);
      }, { once: true });
    } else if (savedSection === 'git' && currentLevel !== 1) {
      frames[1].el.addEventListener('load', () => {
        switchLevel(currentLevel);
      }, { once: true });
    }
  } else if (currentLevel !== 1) {
    frames[1].el.addEventListener('load', () => {
      switchLevel(currentLevel);
    }, { once: true });
  }

  // Load progress
  const visited = JSON.parse(localStorage.getItem('dev-hub-visited') || '[]');
  visited.forEach(sec => {
    const prog = document.getElementById('prog-' + sec);
    if (prog) prog.style.width = '100%';
  });
} catch(e) {}

// ── COMMAND PALETTE (CTRL+K) ──
const cmdOverlay = document.getElementById('cmdOverlay');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');
const btnCmdPalette = document.getElementById('btnCmdPalette');

// Search Index Data
const searchIndex = [
  { title: "Git Basics: Commit, Push, Pull", desc: "Foundational Git commands.", section: "git", color: "var(--l1)" },
  { title: "Git Advanced: Rebase & Stash", desc: "History rewriting and temporary storage.", section: "git", color: "var(--l2)" },
  { title: "Git Expert: Reflog & Bisect", desc: "Data recovery and bug hunting.", section: "git", color: "var(--l3)" },
  { title: "Event Loop & Non-Blocking I/O", desc: "Core architecture of Node.js.", section: "node", color: "var(--node)" },
  { title: "Streams & Buffers", desc: "Handling binary data efficiently.", section: "node", color: "var(--node)" },
  { title: "Express Middleware", desc: "Request pipeline and routing.", section: "node", color: "var(--node)" },
  { title: "MongoDB Aggregation Pipeline", desc: "$match, $group, $lookup.", section: "node", color: "var(--node)" },
  { title: "SQL Joins", desc: "INNER, LEFT, RIGHT, FULL OUTER JOINS.", section: "sql", color: "var(--sql)" },
  { title: "SQL Window Functions", desc: "OVER(), PARTITION BY, ROW_NUMBER().", section: "sql", color: "var(--sql)" },
  { title: "PostgreSQL JSONB", desc: "Working with NoSQL data inside Postgres.", section: "postgres", color: "var(--postgres)" },
  { title: "Postgres Triggers & Functions", desc: "Automating DB logic on mutations.", section: "postgres", color: "var(--postgres)" },
  { title: "JavaScript Closures & Scope", desc: "Lexical scope and variable lifetime.", section: "js", color: "var(--js)" },
  { title: "Promises & Async/Await", desc: "Modern asynchronous JavaScript.", section: "js", color: "var(--js)" },
  { title: "Semantic HTML5", desc: "Accessibility and SEO best practices.", section: "html5", color: "var(--html5)" },
  { title: "Networking: HTTP/HTTPS", desc: "Status codes, headers, and handshakes.", section: "networking", color: "var(--net)" },
  { title: "WebSockets vs Polling", desc: "Real-time bidirectional communication.", section: "networking", color: "var(--net)" },
  { title: "Array Iteration Patterns", desc: "Map, Filter, Reduce, Some, Every.", section: "logic", color: "var(--logic)" },
  { title: "React Interview Prep", desc: "Hooks, Virtual DOM, and State.", section: "react", color: "var(--react)" },
  { title: "JS Deep Guide", desc: "Core JS, DOM, BOM, and pseudocode logic.", section: "jsDeep", color: "var(--cyan)" }
];

let selectedResultIndex = -1;

function renderCmdResults(query) {
  cmdResults.innerHTML = '';
  selectedResultIndex = -1;
  const q = query.toLowerCase().trim();
  
  if (!q) {
    cmdResults.innerHTML = '<div class="cmd-empty">Type to search across all modules...</div>';
    return;
  }
  
  const matches = searchIndex.filter(item => 
    item.title.toLowerCase().includes(q) || 
    item.desc.toLowerCase().includes(q) ||
    item.section.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    cmdResults.innerHTML = '<div class="cmd-empty">No results found for "'+query+'"</div>';
    return;
  }

  matches.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cmd-result-item';
    div.innerHTML = `
      <div class="cmd-res-top">
        <span class="cmd-res-title">${item.title}</span>
        <span class="cmd-res-module" style="background: ${item.color}20; color: ${item.color}">${item.section}</span>
      </div>
      <div class="cmd-res-desc">${item.desc}</div>
    `;
    div.addEventListener('click', () => {
      closeCmdPalette();
      switchSection(item.section);
    });
    cmdResults.appendChild(div);
  });
}

function openCmdPalette() {
  cmdOverlay.classList.add('active');
  cmdInput.value = '';
  renderCmdResults('');
  setTimeout(() => cmdInput.focus(), 100);
}

function closeCmdPalette() {
  cmdOverlay.classList.remove('active');
  cmdInput.blur();
}

document.addEventListener('keydown', (e) => {
  // Open with Ctrl+K or Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openCmdPalette();
  }
  // Close with Esc
  if (e.key === 'Escape' && cmdOverlay.classList.contains('active')) {
    closeCmdPalette();
  }
  
  // Navigate results with arrows
  if (cmdOverlay.classList.contains('active')) {
    const items = cmdResults.querySelectorAll('.cmd-result-item');
    if (items.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedResultIndex = (selectedResultIndex + 1) % items.length;
      updateCmdSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedResultIndex = (selectedResultIndex - 1 + items.length) % items.length;
      updateCmdSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResultIndex >= 0 && selectedResultIndex < items.length) {
        items[selectedResultIndex].click();
      } else if (items.length > 0) {
        items[0].click(); // default to first
      }
    }
  }
});

function updateCmdSelection(items) {
  items.forEach(i => i.classList.remove('selected'));
  if (selectedResultIndex >= 0) {
    items[selectedResultIndex].classList.add('selected');
    items[selectedResultIndex].scrollIntoView({ block: 'nearest' });
  }
}

cmdInput.addEventListener('input', (e) => renderCmdResults(e.target.value));

cmdOverlay.addEventListener('click', (e) => {
  if (e.target === cmdOverlay) closeCmdPalette();
});

if (btnCmdPalette) {
  btnCmdPalette.addEventListener('click', openCmdPalette);
}
