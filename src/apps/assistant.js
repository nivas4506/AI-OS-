// ============================================
// App: AI Assistant — OpenRouter Powered
// ============================================
import { aiEngine } from '../ai/engine.js';

export function createAssistant(container) {
  const connected = aiEngine.isConnected();
  const suggestions = aiEngine.getSuggestions();

  container.innerHTML = `
    <div class="app-assistant">
      <div class="assistant-header">
        <div class="assistant-avatar"><span class="material-symbols-outlined icon-filled">neurology</span></div>
        <div class="assistant-info">
          <h3>AI Assistant</h3>
          <p id="assistant-status" style="color:${connected ? 'var(--success)' : 'var(--warning)'}">
            ${connected ? '● AI Connected' : '● Offline Mode — Add API key in Settings'}
          </p>
        </div>
      </div>
      <div class="assistant-messages" id="assistant-messages">
        <div class="message ai">
          <div class="message-bubble">${connected
      ? "Hello! 👋 I'm your <strong>AI-powered</strong> Assistant. I can help with writing, coding, brainstorming, and answering any questions. What would you like to do?"
      : "Hello! 👋 I'm your AI Assistant. I'm currently in <strong>offline mode</strong>. Add your <strong>API key</strong> in <strong>Settings → AI</strong> to unlock full power!"
    }</div>
          <div class="message-time">${timeStr()}</div>
        </div>
      </div>
      <div class="assistant-suggestions" id="assistant-suggestions">
        ${suggestions.map(s => `<div class="suggestion-chip">${s}</div>`).join('')}
      </div>
      <div class="assistant-input-area">
        <input type="text" class="assistant-input" id="assistant-input" placeholder="${connected ? 'Ask AI anything...' : 'Ask me anything (offline)...'}" autocomplete="off">
        <button class="assistant-send" id="assistant-send"><span class="material-symbols-outlined">send</span></button>
      </div>
    </div>
  `;

  const messagesEl = container.querySelector('#assistant-messages');
  const inputEl = container.querySelector('#assistant-input');
  const sendBtn = container.querySelector('#assistant-send');
  const suggestionsEl = container.querySelector('#assistant-suggestions');
  let sending = false;

  async function sendMessage(text) {
    if (!text.trim() || sending) return;
    sending = true;
    inputEl.value = '';
    inputEl.disabled = true;
    sendBtn.style.opacity = '0.5';
    suggestionsEl.style.display = 'none';

    appendMessage('user', escapeHtml(text));

    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'message ai';
    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'message-bubble';
    bubbleEl.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    aiMsgEl.appendChild(bubbleEl);
    messagesEl.appendChild(aiMsgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      if (aiEngine.isConnected()) {
        await aiEngine.getStreamingResponse(text, (partialText) => {
          bubbleEl.innerHTML = formatResponse(partialText);
          messagesEl.scrollTop = messagesEl.scrollHeight;
        });
      } else {
        const response = await aiEngine.getResponse(text);
        bubbleEl.innerHTML = formatResponse(response);
      }
    } catch (e) {
      bubbleEl.innerHTML = `<span style="color:var(--danger)">⚠️ Error: ${escapeHtml(e.message)}</span>`;
    }

    const timeEl = document.createElement('div');
    timeEl.className = 'message-time';
    timeEl.textContent = timeStr();
    aiMsgEl.appendChild(timeEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    sending = false;
    inputEl.disabled = false;
    inputEl.focus();
    sendBtn.style.opacity = '1';
  }

  function appendMessage(role, html) {
    const msgEl = document.createElement('div');
    msgEl.className = `message ${role}`;
    msgEl.innerHTML = `<div class="message-bubble">${html}</div><div class="message-time">${timeStr()}</div>`;
    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(inputEl.value); });
  sendBtn.addEventListener('click', () => sendMessage(inputEl.value));

  suggestionsEl.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.textContent));
  });

  aiEngine.onStatusChange((status) => {
    const statusEl = container.querySelector('#assistant-status');
    if (statusEl) {
      statusEl.style.color = status === 'connected' ? 'var(--success)' : 'var(--warning)';
      statusEl.textContent = status === 'connected' ? '● AI Connected' : '● Offline Mode';
      inputEl.placeholder = status === 'connected' ? 'Ask AI anything...' : 'Ask me anything (offline)...';
    }
  });

  setTimeout(() => inputEl.focus(), 300);
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;margin:8px 0;overflow-x:auto;font-family:var(--font-mono);font-size:12px;line-height:1.5;">$2</pre>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:12px;">$1</code>')
    .replace(/\n/g, '<br>');
}

function timeStr() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
