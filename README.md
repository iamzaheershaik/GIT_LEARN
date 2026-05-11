# 🚀 Git Masterclass — Zero to Architect

A comprehensive, interactive, browser-based Git learning guide spanning **3 progressive levels** — from absolute beginner to Git architect. No frameworks, no dependencies — just pure HTML, CSS, and JavaScript.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Levels Breakdown](#levels-breakdown)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tech Stack](#tech-stack)
- [Author](#author)

---

## Overview

Git Masterclass is a self-contained, offline-ready learning platform that teaches Git through hands-on terminal examples, interactive quizzes, visual diagrams, and real-world projects. All three levels are unified under a single entry point with a premium level-switcher navigation bar.

---

## ✨ Features

| Feature | Description |
|---|---|
| **3 Progressive Levels** | Beginner → Advanced → Expert, each with unique theming |
| **Level Switcher** | Glassmorphism navigation bar with smooth animated transitions |
| **Interactive Quizzes** | Test your understanding after each section |
| **Copy-to-Clipboard** | One-click copy on all terminal code blocks |
| **Visual Diagrams** | Git workflow diagrams, object trees, and protocol visualizations |
| **Real Projects** | 6 hands-on projects across all levels |
| **Keyboard Navigation** | Press `1` `2` `3` or `←` `→` to switch levels |
| **Persistent Progress** | Last visited level is remembered via localStorage |
| **Lazy Loading** | Iframes load on demand for fast initial page load |
| **Responsive Design** | Fully functional on desktop, tablet, and mobile |
| **Offline Ready** | Works entirely from the filesystem — no server required |

---

## 📁 Project Structure

```
GIT_LEARN/
│
├── index.html                                 # Root entry point — level switcher UI
├── README.md                                  # This file
│
├── html/                                      # HTML pages (pure markup)
│   ├── git-masterclass.html                   #   Level 1 — Foundations
│   ├── git-masterclass-level2.html            #   Level 2 — Advanced
│   └── git-masterclass-level3.html            #   Level 3 — Expert
│
├── styles/                                    # Stylesheets
│   ├── styles.css                             #   Index page styles
│   ├── git-masterclass.css                    #   Level 1 styles (green theme)
│   ├── git-masterclass-level2.css             #   Level 2 styles (amber theme)
│   └── git-masterclass-level3.css             #   Level 3 styles (indigo/teal theme)
│
└── src/                                       # JavaScript
    ├── script.js                              #   Index page logic (level switching)
    ├── git-masterclass.js                     #   Level 1 interactivity
    ├── git-masterclass-level2.js              #   Level 2 interactivity
    └── git-masterclass-level3.js              #   Level 3 interactivity
```

---

## 🏁 Getting Started

No build tools, no installations — just open the file:

```bash
# Option 1: Open directly in your browser
open index.html            # macOS
xdg-open index.html        # Linux
start index.html           # Windows

# Option 2: Serve locally (optional, for full feature support)
npx serve .
# Then visit http://localhost:3000
```

> **Note:** All features work when opened directly as a file (`file://`). A local server is only needed if your browser restricts `localStorage` on file:// origins.

---

## 📚 Levels Breakdown

### Level 1 — Foundations `Beginner`
*Theme: 🟢 Green*

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

### Level 2 — Advanced `Intermediate`
*Theme: 🟠 Amber*

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

### Level 3 — Expert `Elite`
*Theme: 🟣 Indigo/Teal*

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

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` | Switch to Level 1 |
| `2` | Switch to Level 2 |
| `3` | Switch to Level 3 |
| `←` | Previous level |
| `→` | Next level |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, glassmorphism, gradient themes, responsive design
- **Vanilla JavaScript** — DOM manipulation, IntersectionObserver, localStorage
- **Google Fonts** — Inter, Fira Code, Syne, Space Grotesk, DM Sans
- **No frameworks. No build tools. No dependencies.**

---

## 👤 Author

**RyzeN** — Built with ❤️ for developers who want to truly master Git.

---

## 📄 License

This project is open source and available for personal and educational use.

---

<p align="center">
  <strong>git-masterclass</strong> · v3.0 · Complete Series
  <br>
  <em>"The only way to truly master Git is to use it daily."</em>
</p>
