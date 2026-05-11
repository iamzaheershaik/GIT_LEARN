// ── JD → Resume Tailor Agent Logic ──

const SAMPLE_JD = `We are looking for a Full Stack Developer to join our team.

Requirements:
- 1-3 years experience with React.js and Node.js
- REST API development with Express.js
- MongoDB database design
- JWT authentication and Role-Based Access Control (RBAC)
- Git version control
- Strong problem-solving skills
- Bonus: TypeScript, Redis, AWS

Responsibilities:
- Build and maintain scalable REST APIs
- Develop responsive React frontends
- Implement authentication and authorization systems
- Write clean, maintainable code
- Collaborate in agile environment`;

const SAMPLE_RESUME = {
  name: "Mohammed Zaheer Shaik",
  title: "MERN Stack Developer",
  summary: "Aspiring full stack developer with hands-on experience building REST APIs and web applications.",
  skills: ["MongoDB", "Express.js", "React", "Node.js", "JWT", "Git", "JavaScript"],
  experience: [{
    company: "Red & White Multimedia Education",
    role: "MERN Stack Trainee",
    duration: "2023 - 2024",
    bullets: [
      "Learned MERN stack development through intensive training",
      "Built multiple projects including APIs and web apps",
      "Practiced REST API design patterns"
    ]
  }],
  projects: [{
    name: "RBAC REST API",
    bullets: [
      "Built a role-based access control system with JWT",
      "Implemented Admin, Manager, Employee hierarchy",
      "Used Cloudinary for file uploads and Nodemailer for emails"
    ]
  },{
    name: "vibe-error-explainer",
    bullets: [
      "Published npm package that explains Node.js errors in plain English",
      "Added multi-language support and offline dictionary"
    ]
  }]
};

const SYSTEM_PROMPT = `You are an elite ATS Resume Optimization Agent. Your ONLY job is to rewrite a candidate's resume bullet points to perfectly match a given Job Description (JD) — without fabricating skills or experience.

## STRICT RULES
1. NEVER invent skills, tools, or experiences the candidate doesn't have.
2. ALWAYS mirror exact keywords, phrases, and acronyms from the JD.
3. REWRITE bullets using strong action verbs + quantified impact where possible.
4. PRIORITIZE ATS-critical keywords (skills, tools, technologies, certifications) from the JD.
5. REORDER bullet points so the most JD-relevant ones appear first under each role.
6. Keep bullets under 2 lines. Power formula: [Action Verb] + [What you did] + [Tool/Tech] + [Impact/Result].
7. Match the seniority tone of the JD (junior = learning/built; senior = led/architected/scaled).
8. Return ONLY valid JSON — no markdown, no explanation, no preamble.

## OUTPUT FORMAT (strict JSON):
{
  "ats_score": 85,
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword3"],
  "tailored_resume": {
    "name": "...",
    "title": "...(rewritten to match JD title if close enough)",
    "summary": "2-3 sentence ATS-optimized professional summary using JD keywords",
    "skills": ["skill1", "skill2", "...top skills from resume that match JD"],
    "experience": [{ "company": "...", "role": "...", "duration": "...", "bullets": ["..."] }],
    "projects": [{ "name": "...", "bullets": ["..."] }]
  },
  "optimization_notes": ["Note 1", "Note 2"]
}`;

// ── DOM Elements ──
const jdInput = document.getElementById('jdInput');
const resumeInput = document.getElementById('resumeInput');
const jdChars = document.getElementById('jdChars');
const jsonErr = document.getElementById('jsonErr');
const errorMsg = document.getElementById('errorMsg');
const runBtn = document.getElementById('runBtn');
const rightPanel = document.getElementById('rightPanel');

// ── Init with sample data ──
jdInput.value = SAMPLE_JD;
resumeInput.value = JSON.stringify(SAMPLE_RESUME, null, 2);
jdChars.textContent = SAMPLE_JD.length + ' chars';

// ── Event Listeners ──
jdInput.addEventListener('input', () => {
  jdChars.textContent = jdInput.value.length + ' chars';
});

resumeInput.addEventListener('input', () => {
  validateJson(resumeInput.value);
});

// ── State ──
let result = null;
let activeTab = 'bullets';

// ── Helpers ──
function validateJson(str) {
  try {
    JSON.parse(str);
    jsonErr.style.display = 'none';
    return true;
  } catch (e) {
    jsonErr.style.display = '';
    jsonErr.textContent = '⚠ Invalid JSON: ' + e.message;
    return false;
  }
}

function scoreColor(s) {
  return s >= 80 ? '#00ff9d' : s >= 60 ? '#ffcc00' : '#ff4d4d';
}

function showError(msg) {
  errorMsg.style.display = '';
  errorMsg.textContent = msg;
}

function hideError() {
  errorMsg.style.display = 'none';
}

// ── Run Agent ──
async function runAgent() {
  if (!jdInput.value.trim()) { showError('Paste a Job Description first.'); return; }
  if (!validateJson(resumeInput.value)) return;
  hideError();
  result = null;
  runBtn.disabled = true;
  runBtn.innerHTML = '<span class="spinner">◌</span> AGENT RUNNING...';

  rightPanel.innerHTML = `
    <div class="loading">
      <div class="load-spinner"></div>
      <div class="load-text">ANALYZING JD + RESUME...</div>
      <div class="load-step" style="animation:fadeIn .5s 0s both">→ Extracting ATS keywords</div>
      <div class="load-step" style="animation:fadeIn .5s .6s both">→ Matching experience</div>
      <div class="load-step" style="animation:fadeIn .5s 1.2s both">→ Rewriting bullets</div>
      <div class="load-step" style="animation:fadeIn .5s 1.8s both">→ Scoring match</div>
    </div>`;

  try {
    const userPrompt = `## JOB DESCRIPTION\n${jdInput.value}\n\n## CANDIDATE RESUME (JSON)\n${resumeInput.value}\n\nRewrite this resume to maximize ATS match for the above JD. Return ONLY valid JSON.`;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });
    const data = await res.json();
    const raw = (data.content || []).map(b => b.text || '').join('').trim();
    const clean = raw.replace(/```json|```/g, '').trim();
    result = JSON.parse(clean);
    activeTab = 'bullets';
    renderResult();
  } catch (e) {
    showError('Agent failed: ' + e.message);
    rightPanel.innerHTML = `
      <div class="empty">
        <div class="icon">◎</div>
        <div class="label">AWAITING INPUT</div>
        <div class="hint">Paste a JD + your resume JSON on the left, then hit TAILOR MY RESUME</div>
      </div>`;
  } finally {
    runBtn.disabled = false;
    runBtn.innerHTML = '⚡ TAILOR MY RESUME';
  }
}

// ── Tab Switching ──
function switchTab(tab) {
  activeTab = tab;
  renderResult();
}

// ── Copy Output ──
function copyOutput() {
  if (!result) return;
  navigator.clipboard.writeText(JSON.stringify(result.tailored_resume, null, 2));
  const btn = document.getElementById('copyBtn');
  btn.classList.add('copied');
  btn.textContent = '✓ COPIED';
  setTimeout(() => {
    btn.classList.remove('copied');
    btn.textContent = 'COPY JSON';
  }, 2000);
}

// ── Render Result ──
function renderResult() {
  if (!result) return;
  const sc = scoreColor(result.ats_score);
  const matchKw = (result.matched_keywords || []).slice(0, 6)
    .map(k => `<span class="kw match">✓ ${k}</span>`).join('');
  const missKw = (result.missing_keywords || []).slice(0, 3)
    .map(k => `<span class="kw miss">✗ ${k}</span>`).join('');

  let tabHTML = '';
  if (activeTab === 'bullets') tabHTML = renderBullets();
  else if (activeTab === 'summary') tabHTML = renderSummary();
  else if (activeTab === 'notes') tabHTML = renderNotes();
  else if (activeTab === 'raw') tabHTML = `<pre class="raw-json">${JSON.stringify(result.tailored_resume, null, 2)}</pre>`;

  const tabs = ['bullets', 'summary', 'notes', 'raw'].map(t =>
    `<button class="tab-btn${activeTab === t ? ' active' : ''}" onclick="switchTab('${t}')">${t.toUpperCase()}</button>`
  ).join('');

  rightPanel.innerHTML = `
    <div class="score-bar">
      <div>
        <div class="score-num" style="color:${sc}">${result.ats_score}</div>
        <div class="score-label">ATS SCORE</div>
      </div>
      <div style="flex:1">
        <div class="score-track">
          <div class="score-fill" style="width:${result.ats_score}%;background:linear-gradient(90deg,#0066ff,${sc})"></div>
        </div>
        <div class="kw-list">${matchKw}${missKw}</div>
      </div>
      <button class="copy-btn" id="copyBtn" onclick="copyOutput()">COPY JSON</button>
    </div>
    <div class="tabs">${tabs}</div>
    <div class="tab-content">${tabHTML}</div>`;
}

function renderBullets() {
  let h = '';
  (result.tailored_resume?.experience || []).forEach(exp => {
    h += `<div style="margin-bottom:24px">
      <div class="exp-role">${exp.role} @ ${exp.company}</div>
      <div class="exp-dur">${exp.duration}</div>`;
    (exp.bullets || []).forEach(b => {
      h += `<div class="bullet exp">→ ${b}</div>`;
    });
    h += '</div>';
  });
  const projs = result.tailored_resume?.projects || [];
  if (projs.length) {
    h += '<div class="proj-label">PROJECTS</div>';
    projs.forEach(p => {
      h += `<div style="margin-bottom:20px"><div class="proj-title">${p.name}</div>`;
      (p.bullets || []).forEach(b => {
        h += `<div class="bullet proj">→ ${b}</div>`;
      });
      h += '</div>';
    });
  }
  return h;
}

function renderSummary() {
  const skills = (result.tailored_resume?.skills || [])
    .map(s => `<span class="skill-tag">${s}</span>`).join('');
  return `
    <div class="summary-box">${result.tailored_resume?.summary || ''}</div>
    <div class="section-label2">MATCHED SKILLS</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">${skills}</div>
    <div class="section-label2" style="margin-top:20px">SUGGESTED TITLE</div>
    <div class="suggested-title">${result.tailored_resume?.title || ''}</div>`;
}

function renderNotes() {
  let h = '';
  (result.optimization_notes || []).forEach((n, i) => {
    h += `<div class="note"><span class="note-num">${i + 1}.</span>${n}</div>`;
  });
  const missing = result.missing_keywords || [];
  if (missing.length) {
    h += '<div style="margin-top:20px"><div class="gap-label">GAPS TO ADDRESS</div>';
    missing.forEach(k => {
      h += `<div class="gap-item">✗ ${k} — consider adding this to your skill set or project descriptions</div>`;
    });
    h += '</div>';
  }
  return h;
}
