// ============================================
// App: Settings — OpenRouter API
// ============================================
import { aiEngine } from '../ai/engine.js';
import { showNotification } from '../core/notifications.js';

export function createSettings(container) {
  let activeSection = 'system';
  const accentColors = [
    { name: 'Blue', value: '#60cdff' },
    { name: 'Purple', value: '#b4a0ff' },
    { name: 'Pink', value: '#ff8bda' },
    { name: 'Red', value: '#ff6b6b' },
    { name: 'Orange', value: '#ff922b' },
    { name: 'Yellow', value: '#fcc419' },
    { name: 'Green', value: '#51cf66' },
    { name: 'Teal', value: '#20c997' },
  ];

  function render() {
    const currentAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    container.innerHTML = `
      <div class="app-settings">
        <div class="settings-sidebar">
          <div class="settings-sidebar-title">Settings</div>
          ${['system', 'personalization', 'ai', 'apps', 'about'].map(s => `
            <div class="settings-nav-item ${activeSection === s ? 'active' : ''}" data-section="${s}">
              <span class="material-symbols-outlined">${getIcon(s)}</span>
              ${s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          `).join('')}
        </div>
        <div class="settings-main">${renderSection(currentAccent)}</div>
      </div>
    `;

    container.querySelectorAll('.settings-nav-item').forEach(item => {
      item.addEventListener('click', () => { activeSection = item.dataset.section; render(); });
    });
    container.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        document.documentElement.style.setProperty('--accent', color);
        document.documentElement.style.setProperty('--accent-glow', color + '20');
        render();
      });
    });
    container.querySelectorAll('.toggle').forEach(t => t.addEventListener('click', () => t.classList.toggle('on')));

    const saveKeyBtn = container.querySelector('#save-api-key');
    if (saveKeyBtn) {
      saveKeyBtn.addEventListener('click', () => {
        const key = container.querySelector('#api-key-input')?.value?.trim();
        aiEngine.setApiKey(key || '');
        if (key) {
          showNotification({ title: 'AI Connected', message: '✅ API key saved! AI Assistant is now powered by OpenRouter.', icon: 'neurology', duration: 5000 });
        } else {
          showNotification({ title: 'Key Removed', message: 'Switched to offline mode.', icon: 'info', duration: 4000 });
        }
        render();
      });
    }

    const clearBtn = container.querySelector('#clear-api-key');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const inp = container.querySelector('#api-key-input');
        if (inp) inp.value = '';
        aiEngine.setApiKey('');
        showNotification({ title: 'Key Cleared', message: 'Switched to offline mode.', icon: 'info', duration: 4000 });
        render();
      });
    }

    const testBtn = container.querySelector('#test-ai');
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        testBtn.textContent = 'Testing...';
        testBtn.style.opacity = '0.6';
        try {
          const response = await aiEngine.getResponse('Say "Connection successful!" in exactly those words, nothing else.');
          showNotification({ title: 'AI Test', message: `✅ Response: "${response.slice(0, 80)}"`, icon: 'check_circle', duration: 6000 });
        } catch (e) {
          showNotification({ title: 'Test Failed', message: `❌ ${e.message}`, icon: 'error', duration: 5000 });
        }
        testBtn.textContent = 'Test Connection';
        testBtn.style.opacity = '1';
      });
    }
  }

  function renderSection(currentAccent) {
    switch (activeSection) {
      case 'system': return `
        <div class="settings-section-title">System</div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Performance Mode</div><div class="settings-item-desc">Optimize for performance</div></div><div class="toggle on"></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Animations</div><div class="settings-item-desc">Enable smooth animations</div></div><div class="toggle on"></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Sounds</div><div class="settings-item-desc">Play system sounds</div></div><div class="toggle"></div></div>
        </div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Storage</div><div class="settings-item-desc">Virtual filesystem — Unlimited</div></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Memory</div><div class="settings-item-desc">${(performance.memory?.usedJSHeapSize / 1048576 || 64).toFixed(1)} MB used</div></div></div>
        </div>`;

      case 'personalization': return `
        <div class="settings-section-title">Personalization</div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Accent Color</div><div class="settings-item-desc">Choose your accent color</div></div></div>
          <div style="padding:0 0 12px"><div class="color-swatches">${accentColors.map(c => `<div class="color-swatch ${currentAccent === c.value ? 'selected' : ''}" style="background:${c.value}" data-color="${c.value}" title="${c.name}"></div>`).join('')}</div></div>
        </div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Dark Mode</div><div class="settings-item-desc">Use dark theme</div></div><div class="toggle on"></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Transparency Effects</div><div class="settings-item-desc">Enable glassmorphism</div></div><div class="toggle on"></div></div>
        </div>`;

      case 'ai': return `
        <div class="settings-section-title">AI Configuration</div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info">
            <div class="settings-item-title">Connection Status</div>
            <div class="settings-item-desc" style="color:${aiEngine.isConnected() ? 'var(--success)' : 'var(--warning)'};font-weight:500">
              ${aiEngine.isConnected() ? '✅ Connected — OpenRouter (GPT-OSS 120B)' : '⚠️ Offline Mode — No API key configured'}
            </div>
          </div></div>
        </div>
        <div class="settings-card">
          <div class="settings-item" style="flex-direction:column;align-items:stretch;gap:12px;">
            <div class="settings-item-info">
              <div class="settings-item-title">OpenRouter API Key</div>
              <div class="settings-item-desc">Get your key from <strong>openrouter.ai/keys</strong></div>
            </div>
            <div style="display:flex;gap:8px;">
              <input type="password" id="api-key-input" value="${aiEngine.getApiKey()}"
                placeholder="sk-or-..."
                style="flex:1;height:38px;background:var(--bg-input);border:1.5px solid var(--glass-border);
                border-radius:var(--radius-md);padding:0 14px;font-family:var(--font-mono);font-size:12px;
                color:var(--text-primary);outline:none;">
              <button id="save-api-key" style="height:38px;padding:0 20px;background:var(--accent-secondary);
                color:#fff;border:none;border-radius:var(--radius-md);font-family:var(--font);font-size:13px;
                font-weight:600;cursor:pointer;">Save</button>
              <button id="clear-api-key" style="height:38px;padding:0 14px;background:var(--bg-card);
                color:var(--text-secondary);border:1px solid var(--glass-border);border-radius:var(--radius-md);
                font-family:var(--font);font-size:13px;cursor:pointer;">Clear</button>
            </div>
          </div>
          ${aiEngine.isConnected() ? `
          <div class="settings-item">
            <div class="settings-item-info"><div class="settings-item-title">Test Connection</div><div class="settings-item-desc">Send a test message to verify AI is working</div></div>
            <button id="test-ai" style="height:34px;padding:0 16px;background:var(--bg-card);
              color:var(--accent);border:1px solid var(--accent);border-radius:var(--radius-md);
              font-family:var(--font);font-size:12px;font-weight:500;cursor:pointer;">Test Connection</button>
          </div>` : ''}
        </div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Smart Suggestions</div><div class="settings-item-desc">AI-powered suggestions in search</div></div><div class="toggle on"></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Streaming Responses</div><div class="settings-item-desc">Show responses word-by-word</div></div><div class="toggle on"></div></div>
        </div>
        <div class="settings-card" style="background:rgba(96,205,255,0.05);border-color:rgba(96,205,255,0.15);">
          <div class="settings-item" style="border:none;">
            <div class="settings-item-info">
              <div class="settings-item-title" style="color:var(--accent);">💡 How to get an API key</div>
              <div class="settings-item-desc" style="margin-top:8px;line-height:1.8;">
                1. Go to <strong>openrouter.ai</strong><br>
                2. Sign in or create an account<br>
                3. Go to <strong>Keys</strong> in the dashboard<br>
                4. Click <strong>"Create Key"</strong><br>
                5. Copy and paste it above
              </div>
            </div>
          </div>
        </div>`;

      case 'apps': return `
        <div class="settings-section-title">Apps</div>
        <div class="settings-card">
          ${['AI Assistant', 'File Explorer', 'Notepad', 'Calculator', 'Terminal', 'Weather', 'Chrome'].map(a => `
            <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">${a}</div><div class="settings-item-desc">v1.0.0 — Built-in</div></div></div>
          `).join('')}
        </div>`;

      case 'about': return `
        <div class="settings-section-title">About</div>
        <div class="settings-card">
          <div style="text-align:center;padding:20px;">
            <div style="width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              <img src="/logo.png" style="width:100%; height:100%; object-fit:contain; border-radius:16px;">
            </div>
            <h2 style="font-size:22px;font-weight:700;">AI OS</h2>
            <p style="color:var(--text-secondary);margin-top:4px;">Intelligent Desktop Environment</p>
            <p style="color:var(--accent);margin-top:4px;font-size:12px;">Powered by OpenRouter AI</p>
            <p style="color:var(--text-tertiary);margin-top:12px;font-size:13px;">Version 1.0.0</p>
          </div>
        </div>
        <div class="settings-card">
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">AI Engine</div><div class="settings-item-desc">${aiEngine.isConnected() ? 'OpenRouter — GPT-OSS 120B' : 'Offline Mock'}</div></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Platform</div><div class="settings-item-desc">${navigator.platform}</div></div></div>
          <div class="settings-item"><div class="settings-item-info"><div class="settings-item-title">Resolution</div><div class="settings-item-desc">${screen.width}×${screen.height}</div></div></div>
        </div>`;
      default: return '';
    }
  }

  function getIcon(s) {
    return { system: 'computer', personalization: 'palette', apps: 'apps', ai: 'neurology', about: 'info' }[s] || 'settings';
  }
  render();
}
