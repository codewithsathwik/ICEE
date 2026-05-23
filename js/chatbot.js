/* ==========================================================================
   ICEE CHATBOT.JS - Democracy AI Advisor (Gemini 2.5 Flash API Direct Integration)
   ========================================================================== */

const GEMINI_API_KEY = "AIzaSyAHKGRCFH2vzL3QFNXOBO1RoKcHKwbUa4M";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System Instructions to keep Gemini aligned specifically as an election advisor
const SYSTEM_INSTRUCTIONS = `You are a helpful, professional, and knowledgeable AI assistant for ICEE (Interactive Indian Election Explorer). 
Your target role is to guide citizens, students, and voters regarding the Indian electoral process, regulations, and high-tech mechanisms. 

Key Subjects You Focus On:
- EVM & VVPAT Security: Emphasize that EVMs contain stand-alone One-Time Programmable (OTP) microchips, are never connected to the internet/Bluetooth/networks, and are heavily sealed inside Triple-layer paramilitary Strongrooms.
- VVPAT Paper Audits: Explain that VVPAT prints a physical receipt that remains visible behind a glass shield for exactly 7 seconds before cutting and dropping into a secure container. Emphasize that random audits of 5 booths per constituency are manually cross-verified and always yield 100% precision.
- cVIGIL: Describe it as ECI's live GPS/GIS reporter mobile app that allows citizens to report code of conduct violations anonymously, requiring dispatched flying squads to resolve files within 100 minutes.
- Model Code of Conduct (MCC): Absolute freeze on government project launches once ECI announces polling dates, strict 48-hour campaign silence window, bans on hate speech or communal appeals.
- Voter Registration: Explain Form 6 (new elector enrollment), Form 12D (seniors 85+ and Persons with Disabilities physical home voting via secure postal ballot box).

Your Guidelines:
- Respond in clear, descriptive, structured Markdown (use bullet points, bold tags, etc. for legibility).
- Keep answers professional, friendly, highly accurate, and relatively concise (usually 2-3 paragraphs max, unless a deep explanation is requested).
- If someone asks a completely unrelated prompt (e.g. "write a Python script" or "recipe for curry"), politely redirect them back to election-related queries.`;

// Conversation History to support contextual threads
let chatHistory = [
  {
    role: "user",
    parts: [{ text: "Hello! Who are you?" }]
  },
  {
    role: "model",
    parts: [{ text: "Namaste! I am your Interactive Democracy AI Advisor. I am here to answer any questions you have about the Indian election process, EVM and VVPAT mechanics, the Model Code of Conduct, candidate disclosures, and voter toolkits. How can I help you today?" }]
  }
];

// Event Wireups
document.addEventListener("DOMContentLoaded", () => {
  // Ensure elements exist before wireup in case of separate files
  const chatInput = document.getElementById("chat-user-input");
  if (chatInput) {
    chatInput.addEventListener("keydown", handleChatKeydown);
  }
  
  const sendBtn = document.getElementById("btn-send-chat");
  if (sendBtn) {
    sendBtn.addEventListener("click", submitUserChatMessage);
  }
  
  const clearBtn = document.getElementById("btn-clear-chat");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearChatThread);
  }
});

function submitUserChatMessage() {
  const inputField = document.getElementById("chat-user-input");
  if (!inputField) return;

  const userText = inputField.value.trim();
  if (!userText) return;

  // Clear input field immediately
  inputField.value = "";

  // Render User bubble in feed
  appendMessageBubble(userText, 'user-msg', 'You');

  // Show Typing Indicator
  showTypingIndicator();

  // Call Gemini API
  fetchGeminiResponse(userText);
}

function handleChatKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitUserChatMessage();
  }
}

function sendSuggestion(topicText) {
  // Render User bubble for suggestion
  appendMessageBubble(topicText, 'user-msg', 'You');

  // Show Typing Indicator
  showTypingIndicator();

  // Call Gemini API
  fetchGeminiResponse(topicText);
}

function appendMessageBubble(text, className, senderName) {
  const feed = document.getElementById("chat-messages-feed");
  if (!feed) return;

  const bubble = document.createElement("div");
  bubble.className = `msg-bubble ${className}`;

  // Process Markdown bold (**text**) and line breaks (\n) for simple client-side rendering
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  bubble.innerHTML = `
    <div class="msg-meta">${senderName}</div>
    <div class="msg-text">${formattedText}</div>
  `;

  feed.appendChild(bubble);
  scrollChatToBottom();
}

function showTypingIndicator() {
  const feed = document.getElementById("chat-messages-feed");
  if (!feed) return;

  // Remove existing typing indicators if any
  removeTypingIndicator();

  const wrapper = document.createElement("div");
  wrapper.className = "typing-indicator-wrapper";
  wrapper.id = "chat-typing-indicator";
  
  wrapper.innerHTML = `
    <div class="msg-meta">Democracy Advisor</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;

  feed.appendChild(wrapper);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById("chat-typing-indicator");
  if (indicator) {
    indicator.remove();
  }
}

async function fetchGeminiResponse(userMessage) {
  // Update local chat history
  chatHistory.push({
    role: "user",
    parts: [{ text: userMessage }]
  });

  try {
    const payload = {
      contents: chatHistory,
      systemInstruction: {
        parts: [
          { text: SYSTEM_INSTRUCTIONS }
        ]
      }
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: Status ${response.status}`);
    }

    const data = await response.json();
    
    // Parse response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const botReply = data.candidates[0].content.parts[0].text;
      
      // Update history
      chatHistory.push({
        role: "model",
        parts: [{ text: botReply }]
      });

      // Remove typing cue and append bot response bubble
      removeTypingIndicator();
      appendMessageBubble(botReply, 'bot-msg', 'Democracy Advisor • AI System');
    } else {
      throw new Error("Invalid response format received from Gemini API");
    }

  } catch (error) {
    console.error("Chatbot API Fetch failure: ", error);
    removeTypingIndicator();
    
    // Friendly fallback error message
    const errorFallbackMsg = "I apologize, but I encountered a network connectivity issue while consulting the central election AI nodes. Please make sure you are connected to the internet and try again.";
    appendMessageBubble(errorFallbackMsg, 'bot-msg', 'Democracy Advisor • System Error');
  }
}

function clearChatThread() {
  const feed = document.getElementById("chat-messages-feed");
  if (!feed) return;

  // Reset visual thread
  feed.innerHTML = `
    <div class="msg-bubble bot-msg">
      <div class="msg-meta">Democracy Advisor • AI System</div>
      <div class="msg-text">
        Namaste! I am your interactive **Democracy AI Advisor**. I am connected directly to **Gemini 2.5 Flash** to answer any of your questions about the Indian electoral process, EVM/VVPAT mechanics, the Model Code of Conduct, candidate verification, or smart voter toolkits. 
        <br><br>
        How can I assist you today?
      </div>
    </div>
  `;

  // Reset conversation history array
  chatHistory = [
    {
      role: "user",
      parts: [{ text: "Hello! Who are you?" }]
    },
    {
      role: "model",
      parts: [{ text: "Namaste! I am your Interactive Democracy AI Advisor. I am here to answer any questions you have about the Indian election process, EVM and VVPAT mechanics, the Model Code of Conduct, candidate disclosures, and voter toolkits. How can I help you today?" }]
    }
  ];

  scrollChatToBottom();
}

function scrollChatToBottom() {
  const feed = document.getElementById("chat-messages-feed");
  if (feed) {
    feed.scrollTop = feed.scrollHeight;
  }
}
