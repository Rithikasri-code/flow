<p align="center">
  <img src="assets/banner.svg" alt="Sprint Flow Banner" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/Rithikasri-code/sprint-flow"><img src="https://img.shields.io/badge/Framework-React%2019-06b6d4?style=flat-square&logo=react&logoColor=white&labelColor=0b101b" alt="React 19" /></a>
  <img src="https://img.shields.io/badge/Language-TypeScript-3b82f6?style=flat-square&logo=typescript&logoColor=white&labelColor=0b101b" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%204-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0b101b" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Persistence-IndexedDB-8b5cf6?style=flat-square&labelColor=0b101b" alt="IndexedDB" />
  <img src="https://img.shields.io/badge/Audio-Web%20Audio%20API-3b82f6?style=flat-square&labelColor=0b101b" alt="Web Audio" />
  <img src="https://img.shields.io/badge/Deployment-Cloudflare%20Workers%20%2F%20Nitro-f97316?style=flat-square&logo=cloudflare&logoColor=white&labelColor=0b101b" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local--First-22c55e?style=flat-square&labelColor=0b101b" alt="100% Local-First" />
</p>

---

## ⚡ Overview

**SprintFlow** is a high-performance, local-first sprint planning and deep-work execution engine featuring procedural ambient soundscapes. Built with **React 19**, **TypeScript**, **Vinext / Vite**, **Nitro**, and **IndexedDB**, SprintFlow eliminates backend latency, accounts, telemetry, and external cloud dependencies.

All state—sprint cycles, Pomodoro logs, task dependency trees, and audio streams—lives entirely on the client within persistent IndexedDB transactions, synchronized seamlessly across multiple browser tabs via `BroadcastChannel`.

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    subgraph ClientUI["🖥️ React 19 Frontend"]
        TimerUI["Pomodoro Dial & Session Tracker\n(Circular SVG, Wall-Clock Delta)"]
        SprintBoard["Sprint Planning Board\n(To Do, In Progress, Blocked, Done, Carried)"]
        AudioPlayer["Ambient Sound Controller\n(Volume, Shuffler, Lockscreen MediaSession)"]
    end

    subgraph CoreEngine["⚙️ Local-First State Engine"]
        IDB["IndexedDB Storage Subsystem\n(Atomic Transactions, Zero Telemetry)"]
        Sync["BroadcastChannel Multi-Tab Sync\n(Single-Claim Session Completion)"]
        Reconcile["Wall-Clock Resumption Engine\n(Handles OS Sleep & Background Throttling)"]
    end

    subgraph AudioEngine["🎵 Audio Synthesis Subsystem"]
        WebAudio["Hardware Audio Clock\n(Pre-scheduled chime triggers)"]
        Compositions["Built-in Ambient Soundscapes\n(10 Procedural Compositions)"]
        CustomImport["User Audio Storage\n(Up to 30MB File Blobs in IndexedDB)"]
    end

    subgraph EdgeRuntime["🌐 Deployment & Edge Runtime"]
        Nitro["Nitro Universal Server Engine"]
        CF["Cloudflare Worker & PWA Service Worker"]
    end

    ClientUI <--> CoreEngine
    CoreEngine <--> AudioEngine
    ClientUI <--> EdgeRuntime
```

---

## 🚀 Key Engineering Highlights

### 1. **Robust Background Resumption (No Drift)**
Browser tabs are aggressively throttled or suspended by modern operating systems. Rather than relying on fragile `setInterval` ticks:
- SprintFlow binds all timers to **wall-clock UTC target timestamps**.
- Upon document focus or wake event, the reconciliation engine computes exact delta elapsed time, preventing runaway fictitious sessions.
- Timed alarms are pre-scheduled directly onto the hardware **Web Audio API clock**, firing on time even during CPU throttling.

### 2. **Multi-Tab Concurrency via `BroadcastChannel`**
- Multiple open tabs share state via transactional locks and event broadcasting.
- When a timer completes in one tab, an atomic IndexedDB transaction claims the completion record exactly once, preventing duplicate notifications across windows.

### 3. **Autonomous Sprint Cycles**
- Supports Daily, Weekly, Fortnightly, and Calendar-Month sprints with sticky day-of-month anchoring.
- Intelligent rollover handles incomplete tasks upon crossing midnight, with single-click options to carry forward or cleanly abandon with audit retention.

### 4. **Privacy-Preserving Offline PWA**
- Complete Service Worker caching for instant offline boots.
- Encrypted or raw JSON backup/restore mechanics for portable state migration.

---

## 💻 Developer Quickstart

### Prerequisites
* **Node.js 22+ or 24+**
* **npm**

### Development Mode
```bash
# Clone the repository
git clone https://github.com/Rithikasri-code/sprint-flow.git
cd sprint-flow

# Install pinned dependencies
npm ci

# Boot local Vite development server
npm run dev
```
Navigate to `http://localhost:4317` to launch the application.

---

## 🧪 Testing & Verification

SprintFlow comes with automated verification scripts and tests:

```bash
# Run unit & integration test suites
npm test

# Static type checking
npm run typecheck

# Code quality & formatting
npm run lint
npm run format

# Production build preview
npm run build:preview
PORT=4173 npm start
```

---

## 🌐 Cloudflare Workers Deployment

SprintFlow compiles directly to a Cloudflare Worker via Nitro:

```bash
# Build production bundle
npm run build

# Deploy to Cloudflare Workers
npx wrangler deploy
```

---

## 📄 License

Distributed under the **MIT License**.
