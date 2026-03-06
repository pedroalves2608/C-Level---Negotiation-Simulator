<<<<<<< HEAD
# 🎯 C-Level — Negotiation Simulator

An interactive **salary & career negotiation simulator** where you practice real scenarios with an AI counterpart. Get real-time tactical feedback after each move so you can sharpen your approach before the real conversation.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

---

## ✨ What it does

- **Choose a scenario** — Promotion denied, competing offer leverage, or initial offer negotiation.
- **Negotiate in real time** — Chat with an AI playing the other side (manager, HR, or recruiter).
- **Get tactical feedback** — After each exchange, see what landed, what missed, and how to improve.
- **Track your performance** — A “strong moves” score shows how often your tactics are rated effective.

---

## 🚀 Quick start

### Prerequisites

- **Node.js** 18+ and npm
- **Anthropic API key** — [Create one](https://console.anthropic.com/) for Claude API access

### Install & run

```bash
# Clone and enter the project
cd c-level

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`).

### ⚠️ API key setup

The app calls the **Anthropic API** (Claude). You must provide your API key via environment variable.

1. Copy the example env file and add your key:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and set `VITE_ANTHROPIC_API_KEY` to your [Anthropic API key](https://console.anthropic.com/).  
   **Do not commit `.env`** — it should stay in `.gitignore`.

---

## 📜 Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start dev server (Vite)  |
| `npm run build` | Production build      |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint              |

---

## 🎭 Scenarios

| Scenario | Counterpart | Focus |
|----------|-------------|--------|
| **Promotion denied (you're indispensable)** | Direct manager under cost pressure | Keep you without a raise; deferrals, non-financial perks, “policy” |
| **Using a competing offer** | Senior HR / retention | Test if the offer is real, probe commitment, decide on counter-offer |
| **Negotiating the initial offer** | Recruiter with rigid bands | Close within band; non-salary benefits, urgency, enthusiasm |

All scenarios are **advanced** and designed to feel realistic, not cartoonish.

---

## 🛠 Tech stack

- **React 19** — UI and state
- **Vite 7** — Dev server and build
- **TypeScript** — Types in `Negotiation_Simulator.tsx`
- **Anthropic API** — Claude for the counterpart and tactical analysis
- **ESLint** — Linting (React Hooks, React Refresh)

---

## 📁 Project structure

```
c-level/
├── src/
│   ├── App.jsx                 # Root app, mounts simulator
│   ├── App.css
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   ├── Negotiation_Simulator.tsx  # Scenarios, chat, API, scoring
│   └── assets/
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 📄 License

Private — see repository settings.
=======
# C-Level---Negotiation-Simulator
>>>>>>> d8781fa5f38854cbaf7deddb3359af71f92a7037
