// ============================================
// App: Browser
// ============================================

export function createBrowser(container) {
  let currentUrl = '';

  container.innerHTML = `
    <div class="app-browser">
      <div class="browser-toolbar">
        <div class="browser-nav-btn" id="br-back"><span class="material-symbols-outlined">arrow_back</span></div>
        <div class="browser-nav-btn" id="br-forward"><span class="material-symbols-outlined">arrow_forward</span></div>
        <div class="browser-nav-btn" id="br-refresh"><span class="material-symbols-outlined">refresh</span></div>
        <div class="browser-nav-btn" id="br-home"><span class="material-symbols-outlined">home</span></div>
        <input type="text" class="browser-url-bar" id="br-url" placeholder="Search or enter URL..." value="">
      </div>
      <div class="browser-content" id="br-content">
        <div class="browser-new-tab">
          <div style="font-size:48px;margin-bottom:8px;">🌐</div>
          <h2>New Tab</h2>
          <p style="color:var(--text-tertiary);font-size:13px;margin-top:4px;">Enter a URL above to browse the web</p>
          <div style="display:flex;gap:8px;margin-top:24px;flex-wrap:wrap;justify-content:center;">
            ${[
      { name: 'Google', url: 'https://www.google.com', emoji: '🔍' },
      { name: 'Wikipedia', url: 'https://www.wikipedia.org', emoji: '📚' },
      { name: 'GitHub', url: 'https://www.github.com', emoji: '💻' },
      { name: 'YouTube', url: 'https://www.youtube.com', emoji: '▶️' },
    ].map(s => `
              <div class="browser-shortcut" data-url="${s.url}" style="background:var(--bg-card);padding:14px 20px;border-radius:var(--radius-lg);cursor:pointer;text-align:center;min-width:80px;transition:background var(--transition-fast);">
                <div style="font-size:24px;margin-bottom:4px;">${s.emoji}</div>
                <div style="font-size:12px;color:var(--text-secondary);">${s.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const urlBar = container.querySelector('#br-url');
  const contentEl = container.querySelector('#br-content');

  function navigate(url) {
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    let iframeUrl = url;

    // --- Workarounds for Iframe Blocking (X-Frame-Options) ---
    // 1. YouTube
    if (url.includes('youtube.com/watch?v=')) {
      iframeUrl = url.replace('youtube.com/watch?v=', 'youtube.com/embed/').split('&')[0];
    } else if (url.includes('youtu.be/')) {
      iframeUrl = url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
    } else if (url === 'https://www.youtube.com' || url === 'https://youtube.com') {
      iframeUrl = 'https://www.youtube.com/embed/'; // Generic embed works better than blocked main page
    }
    // 2. Google Search
    if (url.includes('google.com/search')) {
      iframeUrl = url + (url.includes('?') ? '&' : '?') + 'igu=1';
    }

    currentUrl = url;
    urlBar.value = url;

    contentEl.innerHTML = `
      <div style="background: rgba(255, 204, 0, 0.1); color: #fcc419; padding: 4px; font-size: 11px; text-align: center; border-bottom: 1px solid rgba(255, 204, 0, 0.2); font-family: var(--font);">
        <strong>Note:</strong> Some major sites (ChatGPT, Gemini, etc.) block being opened inside other applications for security.
      </div>
      <iframe src="${iframeUrl}" style="width:100%; height:calc(100% - 24px); border:none;" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"></iframe>
    `;
  }

  function showHome() {
    currentUrl = '';
    urlBar.value = '';
    contentEl.innerHTML = container.querySelector('.browser-content').innerHTML;
    attachShortcuts();
  }

  function attachShortcuts() {
    container.querySelectorAll('.browser-shortcut').forEach(el => {
      el.addEventListener('click', () => navigate(el.dataset.url));
      el.addEventListener('mouseenter', () => el.style.background = 'var(--bg-hover)');
      el.addEventListener('mouseleave', () => el.style.background = 'var(--bg-card)');
    });
  }

  urlBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') navigate(urlBar.value);
  });

  container.querySelector('#br-back')?.addEventListener('click', () => {
    const iframe = contentEl.querySelector('iframe');
    if (iframe) { try { iframe.contentWindow.history.back(); } catch (e) { } }
  });
  container.querySelector('#br-forward')?.addEventListener('click', () => {
    const iframe = contentEl.querySelector('iframe');
    if (iframe) { try { iframe.contentWindow.history.forward(); } catch (e) { } }
  });
  container.querySelector('#br-refresh')?.addEventListener('click', () => {
    const iframe = contentEl.querySelector('iframe');
    if (iframe) { try { iframe.src = iframe.src; } catch (e) { } }
  });
  container.querySelector('#br-home')?.addEventListener('click', showHome);

  // Initialize shortcuts for the home page (if user clicks home)
  attachShortcuts();

  // Auto-load Google on startup
  navigate('https://www.google.com/webhp?igu=1');
}
