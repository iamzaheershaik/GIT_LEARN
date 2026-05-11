# 🚀 Dev Hub — Git Masterclass · JD Resume Agent · Crack The JS

A comprehensive, interactive, browser-based **developer learning hub** with **3 integrated tools** — Git Masterclass (3 levels), an AI-powered JD-to-Resume Tailor Agent, and Crack The JS Interview prep. No frameworks, no dependencies — just pure HTML, CSS, and JavaScript.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Sections](#sections)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tech Stack](#tech-stack)
- [Author](#author)

---

## Overview

Dev Hub is a unified developer platform with section-based navigation. Switch between three sections — **Git Masterclass** (3 progressive levels), **JD Resume Agent** (AI-powered ATS optimization), and **Crack The JS** (JavaScript interview prep) — all from one premium UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| **3 Sections** | Git Masterclass, JD Resume Agent, Crack The JS — all in one hub |
| **Section Switcher** | Smooth navigation between sections with themed transitions |
| **3 Git Levels** | Beginner → Advanced → Expert, each with unique color theming |
| **AI Resume Agent** | Paste a JD + resume JSON → get ATS-optimized resume via Claude AI |
| **JS Interview Prep** | 327+ JS MCQ questions, React questions, and coding problems |
| **Interactive Quizzes** | Test your understanding after each section |
| **Copy-to-Clipboard** | One-click copy on all terminal code blocks |
| **Visual Diagrams** | Git workflow diagrams, object trees, and protocol visualizations |
| **Real Projects** | 6 hands-on Git projects across all levels |
| **Keyboard Navigation** | Press `1` `2` `3` or `←` `→` to switch Git levels |
| **Persistent Progress** | Last visited section & level remembered via localStorage |
| **Lazy Loading** | Iframes load on demand for fast initial page load |
| **Responsive Design** | Fully functional on desktop, tablet, and mobile |
| **Offline Ready** | Works entirely from the filesystem — no server required |

---

## 🧩 Sections

### 1. ⌥ Git Masterclass — Zero to Architect

A 3-level progressive Git learning guide with interactive quizzes, terminal examples, and real-world projects.

#### Level 1 — Foundations `Beginner` 🟢

| Module | Topic |
|---|---|
| 01 | Setup & Configuration |
| 02 | Init & Clone |
| 03 | Stage & Commit |
| 04 | Status & Log |
| 05 | Branching |
| 06 | Merging |
| 07 | Remotes |
| 08 | Push & Pull |
| 09 | Fetch & Sync |
| 10 | Revert & Reset |
| 11 | Stash |
| 12 | Rebase |
| 13 | Cherry-pick |
| 14 | Tags |
| 15 | Bisect & Reflog |
| 16 | Aliases & Tips |
| 17–18 | 🏗️ Projects: Portfolio & Team Flow |
| 19 | Cheat Sheet |

#### Level 2 — Advanced `Intermediate` 🟠

| Module | Topic |
|---|---|
| 01 | Git Internals — Object Model |
| 02 | Git Hooks |
| 03 | Advanced Search |
| 04 | Worktrees |
| 05 | Advanced Rebase |
| 06 | Merge Strategies |
| 07 | Submodules |
| 08 | Subtrees |
| 09 | Git LFS |
| 10 | Sparse Checkout |
| 11 | Commit Standards |
| 12 | GPG Signing |
| 13 | .gitattributes |
| 14 | CI/CD with Git |
| 15 | Monorepos |
| 16 | Performance & GC |
| 17 | Git Bundle |
| 18–19 | 🏗️ Projects: OSS Contrib & Hook System |
| 20 | Cheat Sheet |

#### Level 3 — Expert `Elite` 🟣

| Module | Topic |
|---|---|
| 01 | Git Transport Protocol |
| 02 | Git Notes |
| 03 | Git Replace API |
| 04 | Patch Workflow |
| 05 | Advanced .gitconfig |
| 06 | Smudge/Clean Filters |
| 07 | Credential Management |
| 08 | GIT_TRACE Debugging |
| 09 | Automated Bisect |
| 10 | History Rewriting |
| 11 | Secret Scanning |
| 12 | Branch Protection |
| 13 | Git Flow Deep Dive |
| 14 | Custom Git Commands |
| 15 | GitHub CLI (gh) |
| 16 | Advanced CI Patterns |
| 17–18 | 🏗️ Projects: Release Pipeline & Git Internals |
| 19 | Cheat Sheet |

---

### 2. ⚡ JD Resume Agent — ATS Optimization

An AI-powered resume tailoring tool that rewrites your resume to match any Job Description for maximum ATS score.

| Feature | Description |
|---|---|
| **JD Input** | Paste any job description |
| **Resume JSON Input** | Provide your resume in structured JSON format |
| **AI Processing** | Powered by Claude API for intelligent keyword matching |
| **ATS Score** | Get a numerical ATS compatibility score |
| **Keyword Matching** | See matched & missing keywords at a glance |
| **Tailored Bullets** | Rewritten experience bullets optimized for ATS |
| **Optimization Notes** | AI-generated suggestions for improvement |
| **Copy JSON** | One-click export of optimized resume |

---

### 3. 💻 Crack The JS — Interview Prep

JavaScript interview preparation with 327+ MCQ questions covering core JS, React, and coding challenges.

| Page | Content |
|---|---|
| **JS MCQ** | 327 multiple-choice questions on JavaScript fundamentals |
| **React** | 41 essential React questions for beginners |
| **Pre-Array Logic** | JS & C++ solution patterns for array problems |

🔗 **Live:** [crack-the-js.vercel.app](https://crack-the-js.vercel.app)

---

## 📁 Project Structure

```
GIT_LEARN/
│
├── index.html                                 # Root entry point — section & level switcher
├── README.md                                  # This file
│
├── html/                                      # HTML pages
│   ├── git-masterclass.html                  #   Git Level 1 — Foundations
│   ├── git-masterclass-level2.html           #   Git Level 2 — Advanced
│   ├── git-masterclass-level3.html           #   Git Level 3 — Expert
│   └── jd-resume-agent.html                  #   JD Resume Agent page
│
├── styles/                                    # Stylesheets
│   ├── styles.css                            #   Index page & section switcher styles
│   ├── jd-resume-agent.css                   #   JD Resume Agent styles
│   ├── git-masterclass.css                   #   Level 1 styles (green theme)
│   ├── git-masterclass-level2.css            #   Level 2 styles (amber theme)
│   └── git-masterclass-level3.css            #   Level 3 styles (indigo/teal theme)
│
├── src/                                       # JavaScript
│   ├── script.js                             #   Section & level switching logic
│   ├── jd-resume-agent.js                    #   JD Resume Agent logic
│   ├── git-masterclass.js                    #   Level 1 interactivity
│   ├── git-masterclass-level2.js             #   Level 2 interactivity
│   └── git-masterclass-level3.js             #   Level 3 interactivity
│
└── jd-resume-agent (1).jsx                   # Original React JSX reference
```

---

## 🏁 Getting Started

No build tools, no installations — just open the file:

```bash
# Option 1: Open directly in your browser
open index.html            # macOS
xdg-open index.html        # Linux
start index.html           # Windows

# Option 2: Serve locally (recommended for full feature support)
npx serve .
# Then visit http://localhost:3000
```

> **Note:** All features work when opened directly as a file (`file://`). A local server is only needed if your browser restricts `localStorage` on file:// origins or for the Crack The JS iframe (cross-origin).

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` | Switch to Git Level 1 |
| `2` | Switch to Git Level 2 |
| `3` | Switch to Git Level 3 |
| `←` | Previous Git level |
| `→` | Next Git level |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, glassmorphism, gradient themes, responsive design
- **Vanilla JavaScript** — DOM manipulation, IntersectionObserver, localStorage
- **Claude AI API** — Powers the JD Resume Agent
- **Google Fonts** — Inter, Fira Code, DM Mono, Syne, Space Grotesk, DM Sans
- **No frameworks. No build tools. No dependencies.**

---

## 👤 Author

**Mohammed Zaheer Shaik (RyzeN)** — Built with ❤️ for developers who want to level up.

- 🔗 [GitHub](https://github.com/iamzaheershaik)
- 🌐 [Crack The JS](https://crack-the-js.vercel.app)

---

## 📄 License

This project is open source and available for personal and educational use.

---

<p align="center">
  <strong>dev-hub</strong> · v4.0 · Complete Developer Platform
  <br>
  <em>"Build. Learn. Ship. Repeat."</em>
</p>
