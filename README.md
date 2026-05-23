# ICEE | Interactive Indian Election Explorer 🗳️

[![GitHub License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![HTML5 & CSS3](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20(ES6)-orange.svg)](https://developer.mozilla.org/)
[![Web Audio API](https://img.shields.io/badge/Audio-Synthesizer%20Engine-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

**ICEE (Interactive Indian Election Explorer)** is an immersive, high-fidelity web application designed to educate citizens about the mechanics, protocols, and digital security measures of the world's largest democratic exercise. With responsive layouts, interactive simulators, live counters, and synth engines, ICEE makes election transparency engaging and accessible.


## 🌟 Key Features

### 1. Immersive Elections Dashboard
* **Electoral Metrics:** Real-time odometer counters showing registered electorate (968M), polling stations (1.05M), EVM units (5.5M), and voting phases (7).
* **Constitutional Foundations:** Comprehensive educational sections detailing autonomous constitutional status (Article 324), 100% air-gapped security, and VVPAT audit reliability.

### 2. Democracy AI Chatbot Advisor
* **Intelligent Q&A:** A dedicated conversational portal powered by Gemini AI to answer inquiries about the Model Code of Conduct (MCC), candidate verification, and voting guidelines.
* **Topic Shortcuts:** Instant chips for high-priority inquiries (e.g., EVM security, cVIGIL reports, home voting, and VVPAT audits).

### 3. Interactive Electoral Roadmap (Timeline Stepper)
* Walk through the **6 major stages** of the election lifecycle:
  1. **ECI Announcement:** Explaining schedules and immediate activation of the Model Code of Conduct (MCC).
  2. **Nomination & Scrutiny:** Form 26 disclosures (assets, liabilities, education, trials) and security deposit forfeitures.
  3. **Campaigning Phase:** Rules regarding the 48-Hour Campaign Silence window and loudspeaker noise limits.
  4. **Polling Day:** Mock poll checks (50 mock votes cast at 6:00 AM), indelible ink marks, and remote polling guidelines (Gir Forest's single-voter booth).
  5. **Strongroom Custody:** Params for Thread & Wax manual seals, CAPF 3-tier military guard layers, double-lock vaults, and 24/7 CCTV surveillance feeds.
  6. **Counting & Results:** Control Unit result decryption, 5-booth random VVPAT hand audits, and RO certificate filing.

### 4. High-Fidelity EVM & VVPAT Simulator Hub
* **Cast Vote Simulator:** Interactive EVM Balloting Unit (BU) and VVPAT Printer. Features:
  * Dynamic green "READY" status indicators.
  * 7-Second VVPAT paper verified slip print preview window.
  * **Web Audio Synthesis Beep:** Uses the Web Audio API to synthesize a flat 1000Hz tone (~1.3s duration) mirroring a physical EVM Control Unit recording confirmation.
* **Strongroom Monitor Portal:** Visual CCTV feed status, outer CAPF guard arming indicators, and door seal integrity metrics.
* **Counting Decrypt Portal:** Decryption simulator requiring users to break the signed paper seal, unlock the result compartment, and press "Result" to tally, draw data charts, and display results.
* **VVPAT Random Audit Minigame:** Physical sorting minigame where users drag and group VVPAT slips to cross-verify electronic counts and file matching certificates.

### 5. Modern ECI Tech & Apps
* **cVIGIL Simulator:** Citizen reporter app demonstrating geo-tagged MCC violations, photo attachment triggers, and a **100-minute flying-squad dispatch countdown timer**.
* **Know Your Candidate (KYC):** Dynamic candidate profile directory showcasing educational degrees, financial assets, liabilities, and criminal trial records as mandated by Supreme Court regulations.
* **Home Voting Guide:** Outlining application steps (Form 12D) and secrecy protocols for senior citizens (85+) and Persons with Disabilities (PwDs).

### 6. Smart Voter Toolkit
* **Registration Wizard:** Step-by-step eligibility checker outlining necessary government registration forms (Form 6, Form 7, and Form 8).
* **Smart Voter Trivia Game:** A 5-question civic awareness quiz. Scoring a perfect 5/5 generates a customized certificate drawn dynamically onto an **HTML5 Canvas** for instant download.

---

## 🎨 Design System & Aesthetics
* **Theme:** High-fidelity Glassmorphic Dark Mode with custom `rgba` backing overlays.
* **Color Palette:** Tailored HSL saffron-white-green tricolor spectrum elements emphasizing a national democratic identity without sacrificing premium readability.
* **Typography:** Elegant combinations of Google Fonts **Outfit** (headings) and **Plus Jakarta Sans** (body text).
* **Responsiveness:** Full layout grid transitions shifting fluidly from multi-column desktop setups to single-column swipe layouts on mobile screens.

---

## 🚀 Installation & Local Execution

This repository contains pure, zero-dependency client-side code (HTML5, CSS3, and ES6 Javascript) and can be served using any local web server.

### Prerequisites
You only need a modern web browser and a static HTTP server environment.

### Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/codewithsathwik/ICEE.git
   cd ICEE
   ```

2. **Start a Local Server:**
   Using Node.js (`http-server` or `npx`):
   ```bash
   npx -y http-server -p 8080
   ```
   Or using Python:
   ```bash
   python -m http.server 8080
   ```

3. **Open in Browser:**
   Navigate to `http://localhost:8080` in your web browser.

---

## 🔑 Gemini AI Chatbot API Key Setup

The Democracy AI Chatbot utilizes Google's **Gemini 1.5 Flash API** to answer citizen questions about electoral guidelines. The direct integration is configured locally.

To update or configure your own Gemini API Key:
1. Obtain a free API Key from [Google AI Studio](https://aistudio.google.com/).
2. Open **[js/chatbot.js](file:///d:/Web%20Development/Projects/ICEE/js/chatbot.js)** in your editor.
3. Locate the `GEMINI_API_KEY` declaration at the very top (around line 5):
   ```javascript
   const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
   ``` 
4. Replace the value inside the quotes with your unique API Key and save the file.

---

## 📂 Repository Structure

```
ICEE/
├── index.html       # Semantic HTML5 Application layout & views
├── style.css        # Premium custom stylesheet, Glassmorphic rules & animations
├── nginx.conf       # Custom Nginx configuration for Cloud Run port routing
├── Dockerfile       # Container setup for serverless Google Cloud Run deploy
├── js/
│   ├── app.js       # Core application state, timeline, EVM, and canvas engine
│   └── chatbot.js   # Democracy AI Chatbot integration and shortcuts
└── README.md        # Project documentation
```

---

## 🛠️ Technology Stack
* **Markup:** Semantic HTML5 Structure
* **Styling:** Custom CSS3 with CSS Grid, Flexbox, Variable-based thematic coloring, and interactive `@keyframes` animations.
* **Logic:** Vanilla Javascript (ES6+) for structural DOM bindings, routing switches, and game tallies.
* **Audio Synthesis:** Web Audio API (`AudioContext`, `OscillatorNode`, and `GainNode`) for generating buzzer tones.
* **Graphics & Certificates:** HTML5 Canvas API for client-side certificate image rendering.

---

## 📜 License
This project is licensed under the MIT License. Feel free to use, adapt, and build upon it to foster broader civic education.