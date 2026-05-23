/* ==========================================================================
   ICEE APP.JS - Interactive Core Logic & Simulated Engines
   ========================================================================== */

// Global Application State
const state = {
  activeView: 'home-view',
  statsAnimated: false,
  timelineStep: 0,

  // EVM Cast & Count variables
  cuVotesCount: 0,
  isBuReady: true,
  voteRecord: {
    1: 0, // Arjun Sharma
    2: 0, // Priya Patel
    3: 0, // Rajesh Kumar
    4: 0, // Sarah Fernandes
    5: 0  // NOTA
  },
  cuSealBroken: false,
  resultsDecrypted: false,

  // Audit Minigame state
  auditGameState: 'idle', // idle, playing, completed
  auditCuTotal: 0,
  auditSlipsTotal: 0,
  auditTargetVotes: {},

  // cVIGIL timer interval
  cvigilTimerId: null,
  cvigilTimeLeft: 6000, // 100 minutes in seconds

  // Eligibility Wizard
  wizStep: 0,
  wizAnswers: {},

  // Quiz state
  quizCurrentQuestion: 0,
  quizScore: 0,
  quizAnswersHistory: []
};

// Data Repositories
const candidates = [
  { id: 1, name: "ARJUN SHARMA", party: "NPP (National Progress)", symbol: "☀️", color: "#ff9933" },
  { id: 2, name: "PRIYA PATEL", party: "PDF (People's Democratic)", symbol: "📖", color: "#2563eb" },
  { id: 3, name: "RAJESH KUMAR", party: "ILD (Indian Lok Dal)", symbol: "🌾", color: "#128807" },
  { id: 4, name: "SARAH FERNANDES", party: "CAL (Citizens Alliance)", symbol: "🌳", color: "#0d9488" },
  { id: 5, name: "NOTA", party: "None of the Above", symbol: "❌", color: "#64748b" }
];

const timelineSteps = [
  {
    title: "ECI Announcement",
    badge: "Step 1 of 6",
    desc: "The Election Commission of India (ECI) holds a live press conference to announce the polling schedule, including voting phases, dates for each state, and the counting day. The Model Code of Conduct (MCC) goes into effect instantly across the country.",
    rules: [
      "<strong>Model Code of Conduct:</strong> Absolute freeze on government announcements of new projects, schemes, or financial grants that could favor the ruling party.",
      "<strong>Neutral Machinery:</strong> Bureaucrats, police, and government resources are temporarily transferred under the ECI's control.",
      "<strong>Expense Tracking:</strong> Strict expenditure caps are placed on campaigns, and election observers are deployed."
    ],
    fact: "Did You Know? Once MCC starts, all official portraits of ministers (including the Prime Minister) must be removed or covered in all public government offices and websites!",
    graphic: `<div class="graphic-mic-mcc">
                <div class="mic-base"></div>
                <div class="wave pulse"></div>
                <div class="wave wave-2 pulse"></div>
              </div>`
  },
  {
    title: "Nomination & Scrutiny",
    badge: "Step 2 of 6",
    desc: "Candidates file nomination papers with the local Returning Officer (RO). They must submit a comprehensive affidavit (Form 26) disclosing their education, financial assets, liabilities, and pending criminal trials.",
    rules: [
      "<strong>Affidavit Disclosures:</strong> Details of assets, bank balances, gold, and real estate owned by candidate and spouse must be public.",
      "<strong>Scrutiny Process:</strong> The RO reviews nominations with candidate agents to verify eligibility and handles formal objections.",
      "<strong>Withdrawal Window:</strong> Candidates are given a 2-day period to officially withdraw their nominations if they choose."
    ],
    fact: "Did You Know? Contesting candidates must deposit a security fee of ₹25,000 (₹12,500 for SC/ST). If they fail to get at least 1/6th (16.6%) of the total valid votes cast, this deposit is forfeited ('forfeiture of deposit')!",
    graphic: `<div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                <div style="width:50px; height:64px; border:2px solid #fff; border-radius:4px; padding:6px; background:rgba(255,255,255,0.05); position:relative;">
                  <div style="width:80%; height:4px; background:#ff9933; margin-bottom:6px;"></div>
                  <div style="width:60%; height:4px; background:#fff; margin-bottom:6px;"></div>
                  <div style="width:70%; height:4px; background:#fff; margin-bottom:6px;"></div>
                  <div style="position:absolute; bottom:6px; right:6px; font-size:14px; color:#128807;">✓</div>
                </div>
              </div>`
  },
  {
    title: "The Campaigning Phase",
    badge: "Step 3 of 6",
    desc: "Political parties and independent candidates hit the ground for public rallies, street corners, door-to-door campaigning, and television/social media advertisements to connect with voters.",
    rules: [
      "<strong>48-Hour Campaign Silence:</strong> All public rallies, loud speaker usage, and campaign broadcasts must stop precisely 48 hours before the conclusion of polling.",
      "<strong>Hate Speech:</strong> Strict bans are enforced against appealing to caste, communal sentiments, or using religious places (temples, churches, mosques) for canvassing.",
      "<strong>Digital Approvals:</strong> All political advertisements on social media must be pre-certified by the ECI Media Certification Committee."
    ],
    fact: "Did You Know? The ECI enforces a strict limit on noise pollution. Megaphones and loudspeakers can only be used between 6:00 AM and 10:00 PM, and always require police permits!",
    graphic: `<div style="display:flex; align-items:center; gap:8px;">
                <div style="width:30px; height:30px; border-radius:50%; border:2px solid #fff; position:relative; animation: ripple 1.5s infinite;">
                  <div style="position:absolute; top:8px; left:8px; width:10px; height:10px; background:#ff9933; border-radius:50%;"></div>
                </div>
                <div style="font-size:24px; animation: bounce 1s infinite alternate;">📢</div>
              </div>`
  },
  {
    title: "Polling Day",
    badge: "Step 4 of 6",
    desc: "Millions of citizens head to local schools, government buildings, and remote tents serving as polling booths. The entire voting process is managed by a team of polling officers and monitored by central micro-observers.",
    rules: [
      "<strong>Mock Poll Check:</strong> At 6:00 AM, in front of party polling agents, officers cast 50 mock votes in the EVM to verify the unit is counting perfectly. The data is cleared before actual voting starts.",
      "<strong>Inked Finger:</strong> Voters receive a mark of semi-permanent silver nitrate indelible ink on their left index finger to prevent double voting.",
      "<strong>100m Campaign Zone:</strong> No campaigning, party canvassing, or canvassing booths are permitted within 100 meters of the polling booth."
    ],
    fact: "Did You Know? ECI rules declare that no voter should travel more than 2 kilometers to vote! In the Gir Forest of Gujarat, ECI sets up a dedicated polling booth for a single resident priest!",
    graphic: `<div style="display:flex; align-items:center; gap:15px;">
                <div style="width:14px; height:45px; background:#f2e6d9; border-radius:4px 4px 0 0; border:1.5px solid #444; position:relative; overflow:hidden;">
                  <div style="width:100%; height:15px; background:#000080; position:absolute; top:0;"></div>
                </div>
                <div style="font-size:32px;">👈</div>
              </div>`
  },
  {
    title: "Strongroom Custody",
    badge: "Step 5 of 6",
    desc: "Immediately after polls close, EVMs and VVPATs are locked, sealed with signed paper seals by polling agents, and transported under heavy military escorts to a central warehouse called the Strongroom.",
    rules: [
      "<strong>Triple-Layer Security:</strong> Guarded by CAPF (paramilitary forces) as the inner circle, State Armed Police in the second tier, and local civil police in the outer tier.",
      "<strong>24/7 Surveillance:</strong> Strongroom doors are sealed under multi-lock systems and continuous CCTV coverage. Candidates' agents can camp outside to monitor the facility live.",
      "<strong>No Network:</strong> EVMs contain no internet, Bluetooth, or wireless transceivers, completely isolating them from remote signals."
    ],
    fact: "Did You Know? The keys to the Strongroom are kept under double custody. The locks are physical, and the room can only be accessed with two distinct keys held by different senior officers!",
    graphic: `<div style="position:relative; width:80px; height:60px; background:#1e293b; border:2px solid #64748b; border-radius:6px; display:flex; align-items:center; justify-content:center;">
                <div style="width:24px; height:24px; border-radius:50%; border:3px solid #ff9933; border-top-color:transparent; animation: rotate-ring 2s linear infinite;"></div>
                <div style="font-size:18px; position:absolute;">🔒</div>
              </div>`
  },
  {
    title: "Counting & Results",
    badge: "Step 6 of 6",
    desc: "Under the supervision of the Returning Officer and in full view of candidates and camera feeds, the Strongrooms are unsealed. EVM Control Units are decrypted, tallies are summed, and VVPAT audit checks verify the outcome.",
    rules: [
      "<strong>EVM Result Decrypt:</strong> The unique green paper seal of each Control Unit is broken, and the 'Result' button is pressed to display the vote tally for each candidate on the electronic screen.",
      "<strong>5-Booth VVPAT Audit:</strong> ECI randomly draws 5 polling stations per constituency. Polling officials manually count their paper VVPAT slips to match them against EVM counts.",
      "<strong>Certificate of Election:</strong> The RO formally declares the winner and files Form 21C, awarding the official certificate of election."
    ],
    fact: "Did You Know? Since the introduction of VVPAT verification audits across thousands of booths, there has been absolute alignment with EVM electronic tallies, showing a 100% precision rate!",
    graphic: `<div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                <div style="width:70px; height:35px; background:#22c55e; border-radius:4px; display:flex; align-items:center; justify-content:center; font-family:monospace; font-weight:bold; font-size:14px; border:2px solid #16a34a; box-shadow:0 0 10px rgba(34,197,94,0.4);">
                  96,842
                </div>
                <div style="font-size:16px;">🏆</div>
              </div>`
  }
];

const kycCandidates = [
  {
    id: 1,
    name: "Arjun Sharma",
    party: "National Progress Party (NPP)",
    symbol: "☀️",
    age: 48,
    education: "Master of Arts (Political Science) - Delhi University",
    assets: "₹12.4 Crores",
    liabilities: "₹1.5 Crores",
    criminalCases: 0,
    history: "Active in grassroots administration for 15 years. Served as Municipal Commissioner. Promotes solar energy expansion, rural road networks, and youth technology incubators.",
    status: "Clean Record"
  },
  {
    id: 2,
    name: "Priya Patel",
    party: "People's Democratic Front (PDF)",
    symbol: "📖",
    age: 39,
    education: "M.B.A (Public Policy) - IIM Bangalore",
    assets: "₹4.8 Crores",
    liabilities: "₹42 Lakhs",
    criminalCases: 1,
    history: "Former NGO director focusing on micro-loans for women's self-help groups. 1 pending case related to peaceful assembly and blocking public roads during a farmers' welfare protest in 2023.",
    status: "Minor Protest Case"
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    party: "Indian Lok Dal (ILD)",
    symbol: "🌾",
    age: 62,
    education: "Graduate (B.Sc. Agriculture) - Punjab Agricultural University",
    assets: "₹8.2 Crores",
    liabilities: "₹80 Lakhs",
    criminalCases: 0,
    history: "Farmer-representative and advocate for direct-to-bank crop pricing systems. Focuses on groundwater conservation, electricity subsidies for farming, and local cooperative cold storages.",
    status: "Clean Record"
  },
  {
    id: 4,
    name: "Sarah Fernandes",
    party: "Citizens Alliance League (CAL)",
    symbol: "🌳",
    age: 51,
    education: "Ph.D. in Environmental Science - IISc Bangalore",
    assets: "₹2.9 Crores",
    liabilities: "None",
    criminalCases: 0,
    history: "Environmental scientist and civic activist. Strongly advocates for public transport electrification, smart urban layouts, waste separation, and water body revival in urban areas.",
    status: "Clean Record"
  }
];

const quizQuestions = [
  {
    question: "What is the minimum age required for a citizen to cast their vote in an Indian election?",
    options: ["16 Years", "18 Years", "21 Years", "25 Years"],
    correct: 1,
    explanation: "Under the 61st Constitutional Amendment Act (1988), the voting age in India was lowered from 21 to 18 years, recognizing youth participation in democracy."
  },
  {
    question: "How long does the printed paper slip remain visible in the VVPAT window after a voter presses a candidate button?",
    options: ["3 Seconds", "5 Seconds", "7 Seconds", "10 Seconds"],
    correct: 2,
    explanation: "The printed VVPAT paper slip remains visible behind a transparent glass window for exactly 7 seconds before it is cut and dropped into the sealed compartment."
  },
  {
    question: "Which Constitutional Article establishes the authority and independence of the Election Commission of India (ECI)?",
    options: ["Article 110", "Article 324", "Article 356", "Article 370"],
    correct: 1,
    explanation: "Article 324 of the Constitution guarantees the independence of the ECI, giving it sole power for superintendence, direction, and control of all elections."
  },
  {
    question: "What does ECI's 'cVIGIL' mobile application empower citizens to do?",
    options: [
      "Check their names on the voter list",
      "Apply for a new Voter ID Card online",
      "Report violations of the Model Code of Conduct directly",
      "Vote online from their smartphones"
    ],
    correct: 2,
    explanation: "cVIGIL (Vigilant Citizen) is a high-speed reporting app allowing citizens to record and submit live photo/video evidence of MCC violations, requiring action within 100 minutes."
  },
  {
    question: "On counting day, how many polling booths' VVPAT paper slips are randomly verified per assembly constituency?",
    options: ["1 Booth", "3 Booths", "5 Booths", "10 Booths"],
    correct: 2,
    explanation: "The Election Commission of India mandates that VVPAT paper slips from exactly 5 randomly selected polling booths per constituency must be hand-counted to cross-verify EVM CU totals."
  }
];

// ==========================================================================
// Web Audio Synth Engine (EVM Buzzer Synthesizer)
// ==========================================================================
function playEvmBeep() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // EVM beep sound is typically a flat, loud mid-frequency pitch
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000 Hz pitch

    // Smooth envelope
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime + 1.2); // Beep is quite long (~1.3s)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.35);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1.36);
  } catch (error) {
    console.error("Audio Synthesis error: ", error);
  }
}

// ==========================================================================
// CORE APP ROUTING & INITS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Setup Date
  const dateSpan = document.getElementById("current-date");
  if (dateSpan) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateSpan.textContent = new Date().toLocaleDateString('en-US', options);
  }

  // Sidebar / Mobile Navigation Event Listeners
  const navItems = document.querySelectorAll(".nav-item, .mobile-nav-item");
  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      switchView(target);
    });
  });

  // Load Initial Component States
  initOdometer();
  renderTimelineStep();
  initBallotUnit();
  initKycSection();
  initEligibilityWizard();
  initQuizBox();

  // Set up cVIGIL GPS defaults
  const cvigilLocInput = document.getElementById("cvigil-location");
  if (cvigilLocInput) {
    cvigilLocInput.value = `Ward ${Math.floor(Math.random() * 20) + 1}, Shastri Nagar, Coordinates: 28.6612° N, 77.1685° E`;
  }
});

// View Swapper
function switchView(viewId) {
  // Deactivate all views
  document.querySelectorAll(".content-view").forEach(v => {
    v.classList.remove("active");
  });

  // Activate selected view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add("active");
    state.activeView = viewId;
  }

  // Sync Nav button classes
  document.querySelectorAll(".nav-item, .mobile-nav-item").forEach(btn => {
    if (btn.getAttribute("data-target") === viewId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Title update
  const titles = {
    'home-view': 'Elections Dashboard',
    'chatbot-view': 'Democracy AI Advisor',
    'timeline-view': 'Election Roadmap Process',
    'evm-view': 'EVM & VVPAT Simulator Hub',
    'tech-view': 'ECI High-Tech Shield',
    'toolkit-view': 'Civic Toolkit & Trivia',
  };
  const titleHeader = document.getElementById("header-title");
  if (titleHeader && titles[viewId]) {
    titleHeader.textContent = titles[viewId];
  }

  // Odometer trigger if entering home view
  if (viewId === 'home-view') {
    initOdometer();
  }
}

// ==========================================================================
// DASHBOARD FACTS ODOMETER ANIMATION
// ==========================================================================
function initOdometer() {
  if (state.statsAnimated) return;
  state.statsAnimated = true;

  const countUp = (elemId, target, duration = 1500) => {
    const el = document.getElementById(elemId);
    if (!el) return;

    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));

    // Handle floating points or smaller integers differently
    const isFloat = target % 1 !== 0;

    const timer = setInterval(() => {
      if (isFloat) {
        start += 0.05;
        if (start >= target) {
          el.textContent = target.toFixed(2);
          clearInterval(timer);
        } else {
          el.textContent = start.toFixed(2);
        }
      } else {
        start += Math.ceil(target / 40);
        if (start >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = start;
        }
      }
    }, 30);
  };

  countUp("stat-voters", 968);
  countUp("stat-booths", 1.05);
  countUp("stat-evms", 5.5);
  countUp("stat-phases", 7);
}

// ==========================================================================
// PROCESS TIMELINE ROADMAP ENGINE
// ==========================================================================
function showStep(index) {
  state.timelineStep = index;
  renderTimelineStep();
}

function prevStep() {
  if (state.timelineStep > 0) {
    state.timelineStep--;
    renderTimelineStep();
  }
}

function nextStep() {
  if (state.timelineStep < timelineSteps.length - 1) {
    state.timelineStep++;
    renderTimelineStep();
  }
}

function renderTimelineStep() {
  const current = timelineSteps[state.timelineStep];
  if (!current) return;

  // Update stepper line progress
  const progressFill = document.getElementById("timeline-progress");
  if (progressFill) {
    const pct = (state.timelineStep / (timelineSteps.length - 1)) * 100;
    progressFill.style.width = `${pct}%`;
  }

  // Update nodes styling
  document.querySelectorAll(".step-node").forEach((node, idx) => {
    node.classList.remove("active", "completed");
    if (idx === state.timelineStep) {
      node.classList.add("active");
    } else if (idx < state.timelineStep) {
      node.classList.add("completed");
    }
  });

  // Populate detail card
  const title = document.getElementById("step-title");
  const numBadge = document.getElementById("step-num-badge");
  const desc = document.getElementById("step-desc");
  const rulesList = document.getElementById("step-rules");
  const fact = document.getElementById("step-fact");
  const graphic = document.getElementById("step-graphic");

  if (title) title.textContent = current.title;
  if (numBadge) numBadge.textContent = current.badge;
  if (desc) desc.textContent = current.desc;
  if (fact) fact.textContent = current.fact;
  if (graphic) graphic.innerHTML = current.graphic;

  // Render Rules
  if (rulesList) {
    rulesList.innerHTML = '';
    current.rules.forEach(rule => {
      const li = document.createElement("li");
      li.innerHTML = rule;
      rulesList.appendChild(li);
    });
  }

  // Update Navigation buttons state
  const prevBtn = document.getElementById("btn-prev-step");
  const nextBtn = document.getElementById("btn-next-step");

  if (prevBtn) prevBtn.disabled = (state.timelineStep === 0);
  if (nextBtn) {
    if (state.timelineStep === timelineSteps.length - 1) {
      nextBtn.textContent = "Finish & Explore EVM";
      nextBtn.onclick = () => switchView('evm-view');
    } else {
      nextBtn.textContent = "Next Step";
      nextBtn.onclick = nextStep;
    }
  }
}

// ==========================================================================
// EVM CAST VOTE SIMULATOR
// ==========================================================================
function initBallotUnit() {
  const ballotList = document.getElementById("ballot-list");
  if (!ballotList) return;

  ballotList.innerHTML = '';
  candidates.forEach(cand => {
    const row = document.createElement("div");
    row.className = `ballot-row ${cand.id === 5 ? 'nota-row' : ''}`;
    row.id = `ballot-cand-${cand.id}`;

    row.innerHTML = `
      <div class="c-num-lbl">${String(cand.id).padStart(2, '0')}</div>
      <div class="c-symbol-img">${cand.symbol}</div>
      <div class="c-meta-info">
        <span class="c-name-lbl">${cand.name}</span>
        <span class="c-party-lbl">${cand.party}</span>
      </div>
      <div class="c-led-light" id="c-led-${cand.id}"></div>
      <button class="c-btn-blue" id="c-btn-${cand.id}" onclick="castVote(${cand.id})"></button>
    `;
    ballotList.appendChild(row);
  });
}

function castVote(candId) {
  if (!state.isBuReady) return;
  state.isBuReady = false;

  const candidate = candidates.find(c => c.id === candId);
  if (!candidate) return;

  // Visual cues
  // Turn off ready green light
  document.getElementById("bu-led-green").classList.remove("active");
  document.getElementById("bu-led-green").previousElementSibling.textContent = "Busy (Red)";

  // Light up candidate row red LED
  const cLed = document.getElementById(`c-led-${candId}`);
  if (cLed) cLed.classList.add("active");

  // Disable all buttons immediately
  document.querySelectorAll(".c-btn-blue").forEach(btn => btn.disabled = true);

  // Log in security terminal
  addConsoleEntry(`BU: Button ${candidate.id} pressed. Processing voter key...`, 'select-entry');

  // Trigger VVPAT slip print
  const vvpatLed = document.getElementById("vvpat-led-busy");
  if (vvpatLed) vvpatLed.classList.add("busy");

  const paperSlip = document.getElementById("vvpat-paper-slip");
  if (paperSlip) {
    // Set slip text
    document.getElementById("slip-c-num").textContent = String(candidate.id).padStart(2, '0');
    document.getElementById("slip-c-name").textContent = candidate.name;
    document.getElementById("slip-c-symbol").textContent = candidate.symbol;
    document.getElementById("slip-c-party").textContent = candidate.party.split(' ')[0];

    // Reset styles and print
    paperSlip.className = "vvpat-slip printing";

    // Log
    addConsoleEntry(`VVPAT: Receipt slip loaded on grid. Verifiable paper sequence...`);
  }

  // Active guide steps updates
  document.getElementById("guide-step-1").classList.remove("active");
  document.getElementById("guide-step-2").classList.add("active");

  // Play EVM Synthesized Beep exactly at slip drop / cut (7 seconds total display)
  setTimeout(() => {
    // Slip drops visual cut
    if (paperSlip) {
      paperSlip.className = "vvpat-slip dropped";
    }

    // Sound synthesized buzzer
    playEvmBeep();

    addConsoleEntry(`CU: Synthesized secure buzzer triggered. Vote recorded in permanent PROM.`, 'success-entry');

    // Update active guide steps
    document.getElementById("guide-step-2").classList.remove("active");
    document.getElementById("guide-step-3").classList.add("active");
    document.getElementById("guide-step-4").classList.add("active");

    // Add tally electronically to Control Unit state
    state.voteRecord[candId]++;
    state.cuVotesCount++;

    // Update UI counters
    document.getElementById("live-cu-counter-val").textContent = String(state.cuVotesCount).padStart(2, '0');

    // Reset loop so next voter can vote
    setTimeout(() => {
      // Clear indicators
      if (cLed) cLed.classList.remove("active");
      if (vvpatLed) vvpatLed.classList.remove("busy");
      if (paperSlip) {
        paperSlip.className = "vvpat-slip"; // Hide it back inside printer
      }

      // Turn on green ready light
      document.getElementById("bu-led-green").classList.add("active");
      document.getElementById("bu-led-green").previousElementSibling.textContent = "Ready (Green)";

      // Enable all buttons
      document.querySelectorAll(".c-btn-blue").forEach(btn => btn.disabled = false);

      // Reset active guides
      document.getElementById("guide-step-3").classList.remove("active");
      document.getElementById("guide-step-4").classList.remove("active");
      document.getElementById("guide-step-1").classList.add("active");

      state.isBuReady = true;
      addConsoleEntry(`EVM: Ready for next voter. Unlocked by presiding supervisor.`);
    }, 1500); // 1.5s post-beep cooldown

  }, 5000); // Wait 5 seconds displaying slip, then beep & drop (total ~7s visual flow)
}

function addConsoleEntry(text, styleClass = '') {
  const consoleLog = document.getElementById("vote-console-log");
  if (!consoleLog) return;

  const entry = document.createElement("div");
  entry.className = `entry ${styleClass}`;

  const timestamp = new Date().toLocaleTimeString([], { hour12: false });
  entry.innerHTML = `<span style="color:#64748b;">[${timestamp}]</span> &gt; ${text}`;

  consoleLog.appendChild(entry);
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

function resetSimulator() {
  state.cuVotesCount = 0;
  Object.keys(state.voteRecord).forEach(k => state.voteRecord[k] = 0);

  document.getElementById("live-cu-counter-val").textContent = "00";

  // Clear counting day decrypt state
  state.cuSealBroken = false;
  state.resultsDecrypted = false;

  // Reset CU counting screen
  const screenLine1 = document.getElementById("cu-screen-line-1");
  const screenLine2 = document.getElementById("cu-screen-line-2");
  if (screenLine1) screenLine1.textContent = "AWAITING DECRYPT";
  if (screenLine2) {
    screenLine2.className = "cu-screen-text text-yellow";
    screenLine2.textContent = "PRESS BREAK SEAL";
  }

  // Lock Result button again
  const cuComp = document.getElementById("cu-buttons-compartment");
  if (cuComp) cuComp.classList.add("locked");

  const resBtn = document.getElementById("btn-cu-result");
  if (resBtn) resBtn.disabled = true;

  const sealCont = document.getElementById("cu-seal-container");
  if (sealCont) sealCont.style.display = "flex";

  const rBody = document.getElementById("counting-results-body");
  if (rBody) {
    rBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No decrypted results yet. Press Result on the CU.</td></tr>`;
  }

  const chartCont = document.getElementById("counting-chart-container");
  if (chartCont) {
    chartCont.style.display = "none";
    chartCont.innerHTML = '';
  }

  // Clear console log
  const consoleLog = document.getElementById("vote-console-log");
  if (consoleLog) {
    consoleLog.innerHTML = `<div class="entry select-entry">&gt; EVM System Initialized. Awaiting vote.</div>`;
  }

  alert("EVM Simulator cleared! Electronic counters and counting tallies reset.");
}

// ==========================================================================
// EVM TABS CONTROL
// ==========================================================================
function switchEvmTab(tabId) {
  document.querySelectorAll(".evm-tab").forEach(tab => {
    if (tab.getAttribute("data-tab") === tabId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  document.querySelectorAll(".evm-tab-content").forEach(c => {
    c.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");

  // If result counting day tab is selected, sync the display values
  if (tabId === 'evm-count') {
    syncCountingDayStatus();
  }
}

// ==========================================================================
// RESULT DECRYPTION & COUNTING HUB (CONTROL UNIT)
// ==========================================================================
function syncCountingDayStatus() {
  // If result already decrypted, show it
  if (state.resultsDecrypted) {
    renderDecryptedResults();
  }
}

function breakCuSeal() {
  state.cuSealBroken = true;

  // Hide paper seal visual
  const sealSection = document.getElementById("cu-seal-container");
  if (sealSection) sealSection.style.display = "none";

  // Unlock compartment controls
  const cuComp = document.getElementById("cu-buttons-compartment");
  if (cuComp) cuComp.classList.remove("locked");

  const resBtn = document.getElementById("btn-cu-result");
  if (resBtn) resBtn.disabled = false;

  // Update Screen
  const screenLine2 = document.getElementById("cu-screen-line-2");
  if (screenLine2) {
    screenLine2.className = "cu-screen-text";
    screenLine2.textContent = "READY - PRESS RESULT";
  }
}

function pressCuResult() {
  if (!state.cuSealBroken) return;

  const screenLine1 = document.getElementById("cu-screen-line-1");
  const screenLine2 = document.getElementById("cu-screen-line-2");
  const resBtn = document.getElementById("btn-cu-result");

  if (resBtn) resBtn.disabled = true;

  // Simulated screen cycling text
  const steps = [
    { l1: "BOOTING CU M3...", l2: "DEC KEY LOADED" },
    { l1: "POLL STATUS: COMP", l2: "SEALS INTEGRITY OK" },
    { l1: "TOTAL ELECTORATE", l2: "CU COUNT: " + String(state.cuVotesCount).padStart(3, '0') },
    { l1: "COMPUTING TALLY...", l2: "DECRYPTING PROM" }
  ];

  let i = 0;
  const cycle = setInterval(() => {
    if (i < steps.length) {
      if (screenLine1) screenLine1.textContent = steps[i].l1;
      if (screenLine2) {
        screenLine2.className = "cu-screen-text text-yellow";
        screenLine2.textContent = steps[i].l2;
      }
      i++;
    } else {
      clearInterval(cycle);

      // Compute and show final results
      state.resultsDecrypted = true;
      if (screenLine1) screenLine1.textContent = "RESULT COMPUTED";
      if (screenLine2) {
        screenLine2.className = "cu-screen-text";
        screenLine2.textContent = "TOTAL: " + state.cuVotesCount;
      }

      renderDecryptedResults();
    }
  }, 1000);
}

function renderDecryptedResults() {
  const rBody = document.getElementById("counting-results-body");
  if (!rBody) return;

  rBody.innerHTML = '';

  // We combine simulation votes with a pre-seeded count to make results look realistic 
  // (e.g., thousands of votes reflecting the user's ratio)
  const baseMultiplier = state.cuVotesCount > 0 ? 500 : 0;

  let totalVotesComputed = 0;
  const candidatesTally = candidates.map(cand => {
    // Seed default votes to avoid 0 counts on first load
    const userVotes = state.voteRecord[cand.id];
    let calculatedVotes = userVotes * baseMultiplier;

    // Default seed if user pressed nothing so they see a filled mock table
    if (state.cuVotesCount === 0) {
      const mockSeeds = [38450, 24102, 18900, 11450, 1208];
      calculatedVotes = mockSeeds[cand.id - 1];
    }

    totalVotesComputed += calculatedVotes;

    return {
      ...cand,
      votes: calculatedVotes
    };
  });

  // Sort candidates by highest votes (except NOTA which goes last)
  const sortedCandidates = [...candidatesTally].sort((a, b) => {
    if (a.id === 5) return 1;
    if (b.id === 5) return -1;
    return b.votes - a.votes;
  });

  sortedCandidates.forEach(cand => {
    const pct = totalVotesComputed > 0 ? ((cand.votes / totalVotesComputed) * 100).toFixed(2) : "0.00";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-weight:700;">${cand.symbol} ${cand.name}</td>
      <td class="text-secondary">${cand.party.split(' ')[0]}</td>
      <td style="font-weight:800; color:#fff;">${cand.votes.toLocaleString()}</td>
      <td class="text-yellow" style="font-weight:700;">${pct}%</td>
    `;
    rBody.appendChild(row);
  });

  // Show Chart
  const chartCont = document.getElementById("counting-chart-container");
  if (chartCont) {
    chartCont.style.display = "flex";
    chartCont.innerHTML = '';

    sortedCandidates.forEach(cand => {
      const pct = totalVotesComputed > 0 ? ((cand.votes / totalVotesComputed) * 100).toFixed(2) : "0.00";
      const row = document.createElement("div");
      row.className = "chart-bar-row";
      row.innerHTML = `
        <div class="chart-bar-label">
          <span>${cand.symbol} ${cand.name.split(' ')[0]}</span>
          <span style="font-weight:700; color:var(--text-secondary);">${pct}%</span>
        </div>
        <div class="chart-track">
          <div class="chart-fill" style="width: 0%; background:${cand.color};"></div>
        </div>
      `;
      chartCont.appendChild(row);

      // Trigger width fill with delay to animate nicely
      setTimeout(() => {
        row.querySelector(".chart-fill").style.width = `${pct}%`;
      }, 100);
    });
  }
}

// ==========================================================================
// VVPAT RANDOM AUDIT MINIGAME ENGINE
// ==========================================================================
function startAuditGame() {
  const playfield = document.getElementById("audit-playfield");
  if (!playfield) return;

  // Decide values. If user has cast votes, match that. Else use seeds.
  let targetTotal = state.cuVotesCount;
  let targetMap = { ...state.voteRecord };

  if (targetTotal === 0) {
    // If no votes, seed a quick mini audit total
    targetTotal = 8;
    targetMap = { 1: 3, 2: 2, 3: 2, 4: 1, 5: 0 };
  }

  state.auditCuTotal = targetTotal;
  state.auditTargetVotes = targetMap;
  state.auditSlipsTotal = 0;

  document.getElementById("audit-cu-total").textContent = String(targetTotal).padStart(2, '0');
  document.getElementById("audit-slips-total").textContent = "00";

  // Build sorting board structure inside playfield
  playfield.innerHTML = `
    <div class="audit-game-board">
      <div class="board-header">Audit Check PS #47-B: Drag VVPAT Paper Rolls to correct candidate verification hopper</div>
      <div class="slips-sorter-workspace">
        <!-- Hopper bin for candidate slips -->
        <div class="sorter-column" id="bin-candidates" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'candidate')">
          <div class="column-lbl">Verified Candidate Slips</div>
          <div class="slips-hopper" id="hopper-candidates"></div>
        </div>

        <!-- Pile of raw VVPAT paper rolls -->
        <div class="sorter-column" id="bin-unsorted" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'unsorted')">
          <div class="column-lbl">VVPAT Paper Compartment</div>
          <div class="slips-hopper" id="hopper-unsorted"></div>
        </div>
      </div>
    </div>
  `;

  // Create physical visual slip nodes inside raw compartment
  const hopperUnsorted = document.getElementById("hopper-unsorted");
  let slipId = 100;

  Object.keys(targetMap).forEach(candId => {
    const qty = targetMap[candId];
    const candidate = candidates.find(c => c.id == candId);

    for (let c = 0; c < qty; c++) {
      slipId++;
      const slip = document.createElement("div");
      slip.className = "audit-paper-slip";
      slip.draggable = true;
      slip.id = `slip-node-${slipId}`;
      slip.setAttribute("data-cand-id", candId);
      slip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text", e.target.id);
      });

      slip.innerHTML = `
        <div class="audit-slip-symbol">${candidate.symbol}</div>
        <div class="audit-slip-meta">${candidate.name.split(' ')[0]}</div>
      `;
      hopperUnsorted.appendChild(slip);
    }
  });

  // Enable verify button
  document.getElementById("btn-match-audit").disabled = false;
  state.auditGameState = 'playing';
}

function allowDrop(ev) {
  ev.preventDefault();
}

function handleDrop(ev, binType) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const dragNode = document.getElementById(data);
  if (!dragNode) return;

  if (binType === 'candidate') {
    document.getElementById("hopper-candidates").appendChild(dragNode);
  } else {
    document.getElementById("hopper-unsorted").appendChild(dragNode);
  }

  // Update audit slips tally based on how many are in the Verified column
  const verifiedCount = document.getElementById("hopper-candidates").children.length;
  state.auditSlipsTotal = verifiedCount;
  document.getElementById("audit-slips-total").textContent = String(verifiedCount).padStart(2, '0');
}

function matchAuditCounts() {
  if (state.auditGameState !== 'playing') return;

  if (state.auditSlipsTotal !== state.auditCuTotal) {
    alert(`Audit Error: You have only verified ${state.auditSlipsTotal} slips. The electronic Control Unit (CU) shows ${state.auditCuTotal} votes are inside. Please drag all paper rolls from the VVPAT Compartment into the Verified Candidates bin.`);
    return;
  }

  // Final check - ensure they were dragged to correct verified bins (which they must be, since there's one sorted column)
  state.auditGameState = 'completed';
  document.getElementById("btn-match-audit").disabled = true;

  const playfield = document.getElementById("audit-playfield");
  if (playfield) {
    playfield.innerHTML = `
      <div class="playfield-cover-message" style="color:var(--success-green);">
        <div class="tracker-success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h4>VVPAT Physical Audit: 100% SUCCESS</h4>
        <p>The manual physical roll counts match the encrypted CU tally of <strong>${state.auditCuTotal} votes</strong> with zero errors. Visual verification certificate logged successfully!</p>
        <button class="btn btn-secondary btn-sm" onclick="startAuditGame()">Audit Another Constituency</button>
      </div>
    `;
  }
}

// ==========================================================================
// ECI TECHNOLOGY APPS (cVIGIL, KYC, POSTAL GUIDE)
// ==========================================================================
function switchTechTab(subtabId) {
  document.querySelectorAll(".tech-subtab").forEach(tab => {
    if (tab.getAttribute("data-subtab") === subtabId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  document.querySelectorAll(".tech-tab-panel").forEach(panel => {
    panel.classList.remove("active");
  });

  document.getElementById(subtabId).classList.add("active");
}

// cVIGIL Simulator
function captureMockPhoto() {
  const photoStatus = document.getElementById("cvigil-photo-status");
  const cameraBtn = document.querySelector(".mock-camera-btn");

  if (photoStatus) {
    photoStatus.textContent = "✓ Image-DSCN-884.jpg (Geotagged & Encoded)";
    cameraBtn.classList.add("attached");
  }
}

function submitCvigilReport() {
  const violationType = document.getElementById("cvigil-type").value;
  if (!violationType) {
    alert("Please select a violation category first.");
    return;
  }

  const cameraBtn = document.querySelector(".mock-camera-btn");
  if (!cameraBtn.classList.contains("attached")) {
    alert("Please capture/attach geotagged mock evidence photo before filing.");
    return;
  }

  // Switch phone screens in mockup
  document.getElementById("cvigil-form-container").style.display = "none";
  document.getElementById("cvigil-tracker-container").style.display = "flex";

  // Start simulated ticking clock
  state.cvigilTimeLeft = 6000; // 100 minutes

  if (state.cvigilTimerId) clearInterval(state.cvigilTimerId);

  state.cvigilTimerId = setInterval(() => {
    if (state.cvigilTimeLeft > 0) {
      state.cvigilTimeLeft--;

      const mins = Math.floor(state.cvigilTimeLeft / 60);
      const secs = state.cvigilTimeLeft % 60;

      document.getElementById("cvigil-timer").textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      // Update progress bar
      const fillPct = (state.cvigilTimeLeft / 6000) * 100;
      document.getElementById("cv-fill").style.width = `${fillPct}%`;
    } else {
      clearInterval(state.cvigilTimerId);
    }
  }, 1000);
}

function resetCvigilApp() {
  if (state.cvigilTimerId) clearInterval(state.cvigilTimerId);

  document.getElementById("cvigil-form-container").style.display = "flex";
  document.getElementById("cvigil-tracker-container").style.display = "none";

  // Reset form inputs
  document.getElementById("cvigil-type").value = "";

  const cameraBtn = document.querySelector(".mock-camera-btn");
  cameraBtn.classList.remove("attached");
  document.getElementById("cvigil-photo-status").textContent = "Tap to attach mock photograph";
}

// KYC (Know Your Candidate) Simulator
function initKycSection() {
  const candList = document.getElementById("kyc-candidates-list");
  if (!candList) return;

  candList.innerHTML = '';
  kycCandidates.forEach((cand, idx) => {
    const item = document.createElement("button");
    item.className = `kyc-item ${idx === 0 ? 'active' : ''}`;
    item.onclick = () => showKycProfile(cand.id);

    item.innerHTML = `
      <h6>${cand.name}</h6>
      <span>${cand.party.split(' ')[0]}</span>
    `;
    candList.appendChild(item);
  });

  // Display first profile by default
  showKycProfile(1);
}

function showKycProfile(candId) {
  // Sync active item sidebar selection
  document.querySelectorAll(".kyc-item").forEach((item, idx) => {
    if (idx === (candId - 1)) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  const cand = kycCandidates.find(c => c.id === candId);
  const displayCard = document.getElementById("kyc-display-card");
  if (!displayCard || !cand) return;

  const isClean = cand.criminalCases === 0;

  displayCard.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${cand.symbol}</div>
      <div class="profile-meta-title">
        <h4>${cand.name}</h4>
        <p>${cand.party}</p>
      </div>
    </div>
    
    <div class="profile-body-grid">
      <div class="profile-block">
        <h5>Age</h5>
        <div class="block-val">${cand.age} Years</div>
      </div>
      
      <div class="profile-block">
        <h5>Affidavit Integrity</h5>
        <div class="block-val">
          <span class="${isClean ? 'badge-green' : 'badge-red'}">${cand.status}</span>
        </div>
      </div>
      
      <div class="profile-block">
        <h5>Declared Assets</h5>
        <div class="block-val text-green" style="color:var(--success-green);">${cand.assets}</div>
      </div>

      <div class="profile-block">
        <h5>Education Quals</h5>
        <div class="block-text"><strong>${cand.education.split(' - ')[0]}</strong> from ${cand.education.split(' - ')[1]}</div>
      </div>
    </div>

    <div class="profile-block" style="margin-top:20px; grid-column:span 2;">
      <h5>Constituency Vision & Biography</h5>
      <p class="block-text" style="color:var(--text-secondary); line-height:1.6; margin-top:8px;">${cand.history}</p>
    </div>
  `;
}

// ==========================================================================
// SMART VOTER TOOLKIT (WIZARD & CIVIC CERTIFICATE DRAW ENGINE)
// ==========================================================================
function initEligibilityWizard() {
  showWizStep(0);
}

function showWizStep(stepIdx) {
  state.wizStep = stepIdx;

  // Show only current active step div
  document.querySelectorAll(".wizard-step").forEach((step, idx) => {
    step.classList.remove("active");
    if (idx === stepIdx) {
      step.classList.add("active");
    }
  });

  // Progress Bar
  const fillPct = ((stepIdx + 1) / 4) * 100;
  document.getElementById("wiz-progress").style.width = `${fillPct}%`;
}

function nextWizStep(answer) {
  state.wizAnswers[state.wizStep] = answer;

  if (state.wizStep === 0) {
    if (answer === false) {
      renderWizOutcome(
        "Registration Restrict: Non-Citizen",
        "Only active citizens holding Indian nationality are legally allowed to vote in standard Indian General Elections. NRIs can vote, but they must register as Overseas Electors using Form 6A and appear physically at the booth with their passport.",
        [
          { text: "Learn more about Overseas Voter Registration", url: "https://voters.eci.gov.in/" }
        ]
      );
    } else {
      showWizStep(1);
    }
  }
  else if (state.wizStep === 1) {
    if (answer === 'under18') {
      renderWizOutcome(
        "Voter ID Age Threshold Pending",
        "You must be exactly 18 years or older on the designated qualifying date (Jan 1, April 1, July 1, or Oct 1 of the year) to enroll in the official electoral rolls.",
        [
          { text: "Track pre-registration eligibility details via ECI Portal", url: "https://voters.eci.gov.in/" }
        ]
      );
    } else {
      showWizStep(2);
    }
  }
  else if (state.wizStep === 2) {
    if (answer === 'registered') {
      renderWizOutcome(
        "Ready to Vote! ✓",
        "Excellent! You satisfy all eligibility and registration hurdles. Keep your eye on local polling schedules and ensure you bring an acceptable photo identity proof (Voter ID card, Aadhaar card, Driving License, or Passport) to your designated booth.",
        [
          { text: "Search your name in ECI Electoral Roll directory", url: "https://electorallyst.eci.gov.in/" }
        ]
      );
    } else {
      renderWizOutcome(
        "Action Required: Apply via Form 6",
        "You meet Indian nationality and age qualifications, but your name must actively appear on the Constituency Electoral Roll to cast a vote. File **Form 6** online to enroll as a new voter.",
        [
          { text: "File Form 6 on ECI Official Voter Portal", url: "https://voters.eci.gov.in/" },
          { text: "Download Voter Helpline App (iOS/Android)", url: "https://voters.eci.gov.in/" }
        ]
      );
    }
  }
}

function renderWizOutcome(title, text, actionLinks) {
  showWizStep(3); // Go to outcome panel index

  document.getElementById("wiz-outcome-title").textContent = title;
  document.getElementById("wiz-outcome-text").textContent = text;

  const actionContainer = document.getElementById("wiz-outcome-actions");
  if (actionContainer) {
    actionContainer.innerHTML = '';
    actionLinks.forEach(link => {
      const a = document.createElement("a");
      a.className = "action-link";
      a.href = link.url;
      a.target = "_blank";
      a.textContent = `→ ${link.text}`;
      actionContainer.appendChild(a);
    });
  }
}

function resetWiz() {
  state.wizAnswers = {};
  showWizStep(0);
}

// Smart Voter Quiz Engine
function initQuizBox() {
  state.quizCurrentQuestion = 0;
  state.quizScore = 0;
  state.quizAnswersHistory = [];

  document.getElementById("quiz-container").style.display = "flex";
  document.getElementById("quiz-badge-card").style.display = "none";

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const current = quizQuestions[state.quizCurrentQuestion];
  if (!current) return;

  // Question num badge
  document.getElementById("quiz-q-num").textContent = `Question ${state.quizCurrentQuestion + 1} of ${quizQuestions.length}`;
  document.getElementById("quiz-q-text").textContent = current.question;

  // Options
  const answersBox = document.getElementById("quiz-answers-box");
  answersBox.innerHTML = '';

  current.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt-btn";
    btn.textContent = opt;
    btn.onclick = () => checkQuizAnswer(idx);
    answersBox.appendChild(btn);
  });

  // Progress Bar
  const fillPct = ((state.quizCurrentQuestion + 1) / quizQuestions.length) * 100;
  document.getElementById("quiz-fill").style.width = `${fillPct}%`;

  // Hide feedback box
  document.getElementById("quiz-feedback").style.display = "none";
}

function checkQuizAnswer(selectedIdx) {
  const current = quizQuestions[state.quizCurrentQuestion];
  const answersBox = document.getElementById("quiz-answers-box");
  const feedbackBox = document.getElementById("quiz-feedback");
  const feedStatus = document.getElementById("feedback-status");
  const feedExp = document.getElementById("feedback-explanation");

  if (!answersBox || !feedbackBox) return;

  const isCorrect = (selectedIdx === current.correct);
  if (isCorrect) state.quizScore++;

  state.quizAnswersHistory.push({
    question: state.quizCurrentQuestion,
    selected: selectedIdx,
    correct: isCorrect
  });

  // Style buttons
  Array.from(answersBox.children).forEach((btn, idx) => {
    btn.classList.add("disabled-btn"); // Lock further clicks
    if (idx === current.correct) {
      btn.classList.add("correct-ans");
    } else if (idx === selectedIdx && !isCorrect) {
      btn.classList.add("wrong-ans");
    }
  });

  // Render Explanations
  feedbackBox.style.display = "flex";
  if (isCorrect) {
    feedStatus.className = "correct-feed";
    feedStatus.textContent = "Correct Answer! ✓";
  } else {
    feedStatus.className = "wrong-feed";
    feedStatus.textContent = "Incorrect Answer ✗";
  }
  feedExp.textContent = current.explanation;
}

function nextQuizQuestion() {
  if (state.quizCurrentQuestion < quizQuestions.length - 1) {
    state.quizCurrentQuestion++;
    renderQuizQuestion();
  } else {
    // End Quiz - Show Badge Certificate
    document.getElementById("quiz-container").style.display = "none";

    const badgeCard = document.getElementById("quiz-badge-card");
    badgeCard.style.display = "flex";

    document.getElementById("badge-score").textContent = `${state.quizScore}/${quizQuestions.length}`;
  }
}

function resetQuiz() {
  initQuizBox();
}

// HTML5 Canvas Civic Certificate generator
function claimVoterBadge() {
  const canvas = document.getElementById("cert-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const citizenName = document.getElementById("voter-cert-name").value || "Responsible Citizen";

  // DRAW BEAUTIFUL TECH E-BADGE
  // Background gradient slate
  const bgGrad = ctx.createLinearGradient(0, 0, 600, 400);
  bgGrad.addColorStop(0, '#0b0f19');
  bgGrad.addColorStop(1, '#1b233a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 600, 400);

  // Border Gold lines
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(15, 15, 570, 370);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 560, 360);

  // Header Title
  ctx.fillStyle = '#ff9933';
  ctx.font = 'bold 22px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CIVIC EDUCATION ACADEMY', 300, 65);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.fillText('ELECTION COMMISSION OF INDIA PROTOCOLS KNOWLEDGE TALLY', 300, 85);

  // Divider line tri-color
  ctx.fillStyle = '#ff9933'; ctx.fillRect(200, 95, 65, 2);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(265, 95, 70, 2);
  ctx.fillStyle = '#128807'; ctx.fillRect(335, 95, 65, 2);

  // Body text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 16px serif';
  ctx.fillText('This certificate of democratic awareness is proudly filed for:', 300, 140);

  // Citizen Name
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 28px Outfit, sans-serif';
  ctx.fillText(citizenName, 300, 185);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px Plus Jakarta Sans, sans-serif';
  ctx.fillText(`For completing the Smart Voter Trivia check with a score of ${state.quizScore}/5.`, 300, 225);
  ctx.fillText(`Demonstrates verified understanding of Indian EVM counting, VVPAT verification`, 300, 245);
  ctx.fillText(`and digital monitoring safeguards.`, 300, 265);

  // Gold seal drawing
  const centerX = 300;
  const centerY = 325;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#ca8a04';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fef08a';
  ctx.stroke();

  ctx.fillStyle = '#000';
  ctx.font = 'bold 8px Outfit, sans-serif';
  ctx.fillText('SMART', 300, 323);
  ctx.fillText('VOTER', 300, 332);

  // Ashoka Chakra spokes subtle in gold seal (lines)
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let a = 0; a < 24; a++) {
    const angle = (a * 15) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 26 * Math.cos(angle), centerY + 26 * Math.sin(angle));
    ctx.stroke();
  }

  // Trigger file download
  const imageURI = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `ICEE_Voter_Certificate_${citizenName.replace(/\s+/g, '_')}.png`;
  link.href = imageURI;
  link.click();
}
