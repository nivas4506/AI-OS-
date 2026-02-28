// ============================================
// AI Engine — OpenRouter API Integration
// ============================================

const STORAGE_KEY = 'ai-os-api-key';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';
const DEFAULT_KEY = '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';

const SYSTEM_PROMPT = `You are AI Assistant, the intelligent companion built into AI OS — a web-based desktop environment. You are helpful, friendly, and concise.

Key behaviors:
- Format responses with markdown: **bold**, bullet points, numbered lists, code blocks
- Be conversational but informative
- Keep responses concise (under 200 words unless asked for detail)
- You can help with: writing, coding, brainstorming, explaining concepts, math, and general knowledge
- You are running inside a web-based OS that has apps like File Explorer, Notepad, Calculator, Terminal, Settings, Weather, and Browser
- When users ask about the OS, explain its features enthusiastically
- Use emojis sparingly but effectively for personality`;

// Mock responses as fallback
const MOCK_RESPONSES = [
    { patterns: ['hello', 'hi ', 'hey', 'greetings'], response: "Hello! 👋 I'm your AI Assistant powered by AI OS. What would you like to do today?" },
    { patterns: ['how are you', 'how r u'], response: "I'm running smoothly! All systems are operational. How can I help you today?" },
    { patterns: ['what can you do', 'help', 'features', 'capabilities'], response: "I can help with many things!\n\n🔍 **Search** — Find files and info\n📝 **Write** — Draft emails, docs, code\n💡 **Ideas** — Brainstorm creatively\n📊 **Analyze** — Process data\n⚡ **Automate** — Streamline workflows\n\n💡 **Tip:** Add your API key in Settings → AI to enable full capabilities!" },
    { patterns: ['joke', 'funny', 'laugh'], response: "Here's one! 😄\n\nWhy do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛" },
    { patterns: ['code', 'programming', 'python', 'javascript'], response: "I can help with coding!\n\n```js\nfunction quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}\n```\n\n💡 Add your API key in Settings → AI for real code help!" },
    { patterns: ['who are you', 'your name', 'about you'], response: "I'm **AI Assistant**, built into AI OS! 🤖\n\n• **Engine:** OpenRouter AI (when configured)\n• **Fallback:** Offline mock engine\n\nConfigure your key in **Settings → AI**!" },
    { patterns: ['thank', 'thanks'], response: "You're welcome! 😊" },
    { patterns: ['bye', 'goodbye'], response: "Goodbye! 👋 Have a great day!" },
];

const FALLBACK_RESPONSES = [
    "I'm in offline mode. Add your **API key** in **Settings → AI** to unlock full AI!\n\nTry saying: \"Hello\", \"Tell me a joke\", \"What can you do?\"",
    "To get full AI answers, configure your **API key** in **Settings → AI Configuration**.",
];

export class AIEngine {
    constructor() {
        this.history = [];
        this.apiKey = localStorage.getItem(STORAGE_KEY) || DEFAULT_KEY;
        this._listeners = [];
        this._connected = !!this.apiKey;
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem(STORAGE_KEY, key);
        this._connected = !!key;
        this.history = [];
        this._notifyListeners(key ? 'connected' : 'disconnected');
        return true;
    }

    getApiKey() { return this.apiKey; }
    isConnected() { return this._connected; }
    onStatusChange(cb) { this._listeners.push(cb); }
    _notifyListeners(status) { this._listeners.forEach(cb => cb(status)); }

    _buildMessages(userMessage) {
        const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
        // Include recent history (last 20 messages)
        const recent = this.history.slice(-20);
        for (const m of recent) {
            messages.push({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content });
        }
        messages.push({ role: 'user', content: userMessage });
        return messages;
    }

    async getResponse(message) {
        this.history.push({ role: 'user', content: message });

        if (this._connected && this.apiKey) {
            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'AI OS',
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: this._buildMessages(message),
                        max_tokens: 1024,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error?.message || `HTTP ${res.status}`);
                }

                const data = await res.json();
                const reply = data.choices?.[0]?.message?.content || 'No response received.';
                this.history.push({ role: 'ai', content: reply });
                return reply;
            } catch (e) {
                console.error('API error:', e);
                const errMsg = `⚠️ API error: ${e.message}\n\nCheck your key in Settings → AI.`;
                this.history.push({ role: 'ai', content: errMsg });
                return errMsg;
            }
        }

        // Fallback to mock
        await new Promise(r => setTimeout(r, 500 + Math.random() * 600));
        const lowerMsg = message.toLowerCase().trim();
        for (const item of MOCK_RESPONSES) {
            if (item.patterns.some(p => lowerMsg.includes(p))) {
                this.history.push({ role: 'ai', content: item.response });
                return item.response;
            }
        }
        const fb = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
        this.history.push({ role: 'ai', content: fb });
        return fb;
    }

    async getStreamingResponse(message, onChunk) {
        this.history.push({ role: 'user', content: message });

        if (this._connected && this.apiKey) {
            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'AI OS',
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: this._buildMessages(message),
                        max_tokens: 1024,
                        stream: true,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error?.message || `HTTP ${res.status}`);
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let fullText = '';
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed || !trimmed.startsWith('data: ')) continue;
                        const data = trimmed.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const delta = parsed.choices?.[0]?.delta?.content;
                            if (delta) {
                                fullText += delta;
                                if (onChunk) onChunk(fullText);
                            }
                        } catch { }
                    }
                }

                this.history.push({ role: 'ai', content: fullText });
                return fullText;
            } catch (e) {
                console.error('Streaming error:', e);
                const errMsg = `⚠️ API error: ${e.message}`;
                this.history.push({ role: 'ai', content: errMsg });
                if (onChunk) onChunk(errMsg);
                return errMsg;
            }
        }

        // Fallback — simulate streaming
        const response = await this._getMockResponse(message);
        const words = response.split(' ');
        let built = '';
        for (let i = 0; i < words.length; i++) {
            built += (i > 0 ? ' ' : '') + words[i];
            if (onChunk) onChunk(built);
            await new Promise(r => setTimeout(r, 25 + Math.random() * 35));
        }
        this.history.push({ role: 'ai', content: response });
        return response;
    }

    async _getMockResponse(message) {
        const lowerMsg = message.toLowerCase().trim();
        for (const item of MOCK_RESPONSES) {
            if (item.patterns.some(p => lowerMsg.includes(p))) return item.response;
        }
        return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }

    getSuggestions() {
        if (this.isConnected()) {
            return ["Write a poem", "Explain quantum computing", "Help me code", "Brainstorm ideas", "Tell me a joke"];
        }
        return ["What can you do?", "Tell me a joke", "Help with code", "Open Settings → AI"];
    }

    searchApps(query) {
        const q = query.toLowerCase();
        const allApps = [
            { id: 'assistant', name: 'AI Assistant', icon: 'neurology', keywords: ['ai', 'chat', 'help', 'assistant'] },
            { id: 'explorer', name: 'File Explorer', icon: 'folder_open', keywords: ['file', 'folder', 'explorer'] },
            { id: 'notepad', name: 'Notepad', icon: 'edit_note', keywords: ['note', 'text', 'edit', 'write'] },
            { id: 'calculator', name: 'Calculator', icon: 'calculate', keywords: ['calc', 'math'] },
            { id: 'terminal', name: 'Terminal', icon: 'terminal', keywords: ['terminal', 'console', 'cmd'] },
            { id: 'settings', name: 'Settings', icon: 'settings', keywords: ['settings', 'config', 'theme'] },
            { id: 'weather', name: 'Weather', icon: 'cloud', keywords: ['weather', 'forecast'] },
            { id: 'browser', name: 'Chrome', icon: 'chrome_reader_mode', keywords: ['browser', 'web', 'internet', 'chrome'] },
        ];
        if (!q) return allApps;
        return allApps.filter(app => app.name.toLowerCase().includes(q) || app.keywords.some(k => k.includes(q)));
    }

    resetChat() {
        this.history = [];
    }
}

export const aiEngine = new AIEngine();
