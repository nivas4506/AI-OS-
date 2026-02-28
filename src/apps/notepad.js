// ============================================
// App: Notepad
// ============================================
import { fileSystem } from '../core/filesystem.js';
import { showNotification } from '../core/notifications.js';

export function createNotepad(container, _winId, fileName, initialContent, filePath) {
    let currentFilePath = filePath || null;
    let currentFileName = fileName || 'Untitled';
    let modified = false;

    container.innerHTML = `
    <div class="app-notepad">
      <div class="notepad-menubar">
        <div class="notepad-menu-item" id="np-new">File: New</div>
        <div class="notepad-menu-item" id="np-save">Save</div>
        <div class="notepad-menu-item" id="np-saveas">Save As</div>
        <div class="notepad-menu-item" id="np-wordwrap">Word Wrap: On</div>
      </div>
      <textarea class="notepad-editor" id="np-editor" spellcheck="false">${escapeHtml(initialContent || '')}</textarea>
      <div class="notepad-statusbar">
        <span id="np-filename">${currentFileName}</span>
        <span id="np-stats">Ln 1, Col 1 | 0 characters</span>
      </div>
    </div>
  `;

    const editor = container.querySelector('#np-editor');
    const statsEl = container.querySelector('#np-stats');
    const fileNameEl = container.querySelector('#np-filename');

    function updateStats() {
        const text = editor.value;
        const lines = text.split('\n');
        const pos = editor.selectionStart;
        let ln = 1, col = 1, count = 0;
        for (let i = 0; i < pos; i++) { if (text[i] === '\n') { ln++; col = 1; } else { col++; } }
        statsEl.textContent = `Ln ${ln}, Col ${col} | ${text.length} characters`;
    }

    editor.addEventListener('input', () => { modified = true; updateStats(); });
    editor.addEventListener('click', updateStats);
    editor.addEventListener('keyup', updateStats);

    container.querySelector('#np-new').addEventListener('click', () => {
        editor.value = '';
        currentFilePath = null;
        currentFileName = 'Untitled';
        fileNameEl.textContent = currentFileName;
        modified = false;
        updateStats();
    });

    container.querySelector('#np-save').addEventListener('click', () => {
        if (currentFilePath) {
            fileSystem.writeFile(currentFilePath, editor.value);
            modified = false;
            showNotification({ title: 'Notepad', message: `Saved "${currentFileName}"`, icon: 'save', duration: 3000 });
        } else {
            saveAs();
        }
    });

    container.querySelector('#np-saveas').addEventListener('click', saveAs);

    function saveAs() {
        const name = prompt('Save as (filename):', currentFileName);
        if (!name) return;
        const path = '/Documents/' + name;
        fileSystem.writeFile(path, editor.value);
        currentFilePath = path;
        currentFileName = name;
        fileNameEl.textContent = name;
        modified = false;
        showNotification({ title: 'Notepad', message: `Saved "${name}" to Documents`, icon: 'save', duration: 3000 });
    }

    let wordWrap = true;
    container.querySelector('#np-wordwrap').addEventListener('click', function () {
        wordWrap = !wordWrap;
        editor.style.whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
        editor.style.overflowX = wordWrap ? 'hidden' : 'auto';
        this.textContent = `Word Wrap: ${wordWrap ? 'On' : 'Off'}`;
    });

    setTimeout(() => editor.focus(), 100);
    updateStats();
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
