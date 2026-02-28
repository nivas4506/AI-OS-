// ============================================
// App: File Explorer
// ============================================
import { fileSystem } from '../core/filesystem.js';

export function createExplorer(container) {
    let currentPath = '/';
    let history = ['/'];
    let historyIndex = 0;

    function render() {
        const items = fileSystem.listDir(currentPath);
        const pathParts = currentPath === '/' ? ['root'] : ['root', ...currentPath.replace(/^\//, '').split('/')];

        container.innerHTML = `
      <div class="app-explorer">
        <div class="explorer-sidebar">
          <div class="explorer-tree-item ${currentPath === '/Desktop' ? 'active' : ''}" data-path="/Desktop">
            <span class="material-symbols-outlined icon-filled" style="color:#60cdff">desktop_windows</span> Desktop
          </div>
          <div class="explorer-tree-item ${currentPath === '/Documents' ? 'active' : ''}" data-path="/Documents">
            <span class="material-symbols-outlined icon-filled" style="color:#fcc419">description</span> Documents
          </div>
          <div class="explorer-tree-item ${currentPath === '/Downloads' ? 'active' : ''}" data-path="/Downloads">
            <span class="material-symbols-outlined icon-filled" style="color:#51cf66">download</span> Downloads
          </div>
          <div class="explorer-tree-item ${currentPath === '/Pictures' ? 'active' : ''}" data-path="/Pictures">
            <span class="material-symbols-outlined icon-filled" style="color:#cc5de8">image</span> Pictures
          </div>
          <div class="explorer-tree-item ${currentPath === '/Music' ? 'active' : ''}" data-path="/Music">
            <span class="material-symbols-outlined icon-filled" style="color:#ff922b">music_note</span> Music
          </div>
          <div class="explorer-tree-item ${currentPath === '/Videos' ? 'active' : ''}" data-path="/Videos">
            <span class="material-symbols-outlined icon-filled" style="color:#ff6b6b">videocam</span> Videos
          </div>
        </div>
        <div class="explorer-main">
          <div class="explorer-toolbar">
            <div class="explorer-nav-btn ${historyIndex <= 0 ? 'disabled' : ''}" id="ex-back">
              <span class="material-symbols-outlined">arrow_back</span>
            </div>
            <div class="explorer-nav-btn ${historyIndex >= history.length - 1 ? 'disabled' : ''}" id="ex-forward">
              <span class="material-symbols-outlined">arrow_forward</span>
            </div>
            <div class="explorer-nav-btn" id="ex-up">
              <span class="material-symbols-outlined">arrow_upward</span>
            </div>
            <div class="explorer-breadcrumb">
              ${pathParts.map((p, i) => {
            const path = i === 0 ? '/' : '/' + pathParts.slice(1, i + 1).join('/');
            return `<span class="explorer-breadcrumb-item" data-path="${path}">${p}</span>${i < pathParts.length - 1 ? '<span class="explorer-breadcrumb-sep">›</span>' : ''}`;
        }).join('')}
            </div>
            <div class="explorer-nav-btn" id="ex-new-folder" title="New Folder">
              <span class="material-symbols-outlined">create_new_folder</span>
            </div>
          </div>
          <div class="explorer-content">
            ${items.length === 0
                ? '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-tertiary);"><span class="material-symbols-outlined" style="font-size:48px;display:block;margin-bottom:12px;">folder_off</span>This folder is empty</div>'
                : items.map(item => `
                <div class="explorer-item" data-name="${item.name}" data-type="${item.type}">
                  <div class="explorer-item-icon">
                    <span class="material-symbols-outlined icon-filled" style="color:${item.type === 'folder' ? '#fcc419' : '#74c0fc'}">${item.type === 'folder' ? 'folder' : getFileIcon(item.name)}</span>
                  </div>
                  <div class="explorer-item-name">${item.name}</div>
                </div>
              `).join('')}
          </div>
          <div class="explorer-statusbar">
            <span>${items.length} item${items.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    `;

        // Navigation events
        container.querySelector('#ex-back')?.addEventListener('click', () => {
            if (historyIndex > 0) { historyIndex--; currentPath = history[historyIndex]; render(); }
        });
        container.querySelector('#ex-forward')?.addEventListener('click', () => {
            if (historyIndex < history.length - 1) { historyIndex++; currentPath = history[historyIndex]; render(); }
        });
        container.querySelector('#ex-up')?.addEventListener('click', () => {
            if (currentPath !== '/') {
                const parts = currentPath.split('/').filter(Boolean);
                parts.pop();
                navigateTo('/' + parts.join('/') || '/');
            }
        });
        container.querySelector('#ex-new-folder')?.addEventListener('click', () => {
            const name = prompt('New folder name:');
            if (name) { fileSystem.createFolder((currentPath === '/' ? '' : currentPath) + '/' + name); render(); }
        });

        // Sidebar click
        container.querySelectorAll('.explorer-tree-item').forEach(item => {
            item.addEventListener('click', () => navigateTo(item.dataset.path));
        });

        // Breadcrumb click
        container.querySelectorAll('.explorer-breadcrumb-item').forEach(item => {
            item.addEventListener('click', () => navigateTo(item.dataset.path));
        });

        // Item double-click
        container.querySelectorAll('.explorer-item').forEach(item => {
            item.addEventListener('dblclick', () => {
                const name = item.dataset.name;
                const type = item.dataset.type;
                if (type === 'folder') {
                    navigateTo((currentPath === '/' ? '' : currentPath) + '/' + name);
                } else {
                    // Open file in notepad via global app launcher
                    const content = fileSystem.readFile((currentPath === '/' ? '' : currentPath) + '/' + name);
                    if (content !== null && window.__openNotepadWithContent) {
                        window.__openNotepadWithContent(name, content, (currentPath === '/' ? '' : currentPath) + '/' + name);
                    }
                }
            });

            // Single click to select
            item.addEventListener('click', (e) => {
                container.querySelectorAll('.explorer-item.selected').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
            });
        });
    }

    function navigateTo(path) {
        currentPath = path || '/';
        history = history.slice(0, historyIndex + 1);
        history.push(currentPath);
        historyIndex = history.length - 1;
        render();
    }

    render();
}

function getFileIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    const map = { txt: 'description', md: 'description', js: 'javascript', py: 'code', html: 'html', css: 'css', json: 'data_object', jpg: 'image', png: 'image', gif: 'gif', mp3: 'audio_file', mp4: 'video_file', pdf: 'picture_as_pdf' };
    return map[ext] || 'draft';
}
