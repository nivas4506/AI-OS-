// ============================================
// Window Manager
// ============================================

let zIndexCounter = 100;
let activeWindowId = null;
const windows = new Map();
const onWindowChange = [];

export function onWindowsChanged(cb) { onWindowChange.push(cb); }
function notifyChange() { onWindowChange.forEach(cb => cb(getOpenWindows())); }

export function getOpenWindows() {
    return Array.from(windows.values()).map(w => ({
        id: w.id, title: w.title, icon: w.icon, minimized: w.minimized, active: w.id === activeWindowId,
    }));
}

export function createWindow({ title, icon, width, height, app, onClose, onResize, contentFactory }) {
    const id = 'win-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const container = document.getElementById('windows-container');
    const rect = container.getBoundingClientRect();

    const x = Math.max(40, Math.min(rect.width - (width || 800) - 40, 80 + Math.random() * 200));
    const y = Math.max(20, Math.min(rect.height - (height || 500) - 60, 40 + Math.random() * 100));

    const el = document.createElement('div');
    el.className = 'os-window focused';
    el.id = id;
    el.style.cssText = `left:${x}px;top:${y}px;width:${width || 800}px;height:${height || 500}px;z-index:${++zIndexCounter};`;

    el.innerHTML = `
    <div class="window-titlebar" data-win-id="${id}">
      <div class="window-titlebar-icon"><span class="material-symbols-outlined icon-filled">${icon || 'window'}</span></div>
      <div class="window-title">${title || 'Untitled'}</div>
      <div class="window-controls">
        <div class="window-ctrl-btn minimize" data-action="minimize"><span class="material-symbols-outlined">remove</span></div>
        <div class="window-ctrl-btn maximize" data-action="maximize"><span class="material-symbols-outlined">crop_square</span></div>
        <div class="window-ctrl-btn close" data-action="close"><span class="material-symbols-outlined">close</span></div>
      </div>
    </div>
    <div class="window-content"></div>
    <div class="resize-handle n"></div>
    <div class="resize-handle s"></div>
    <div class="resize-handle e"></div>
    <div class="resize-handle w"></div>
    <div class="resize-handle ne"></div>
    <div class="resize-handle nw"></div>
    <div class="resize-handle se"></div>
    <div class="resize-handle sw"></div>
  `;

    container.appendChild(el);

    const contentEl = el.querySelector('.window-content');
    if (contentFactory) contentFactory(contentEl, id);

    const winData = {
        id, title, icon, el, minimized: false, maximized: false,
        prevRect: null, app, onClose, onResize,
    };
    windows.set(id, winData);

    // --- Event setup ---
    setupDrag(el, winData);
    setupResize(el, winData);
    setupControls(el, winData);

    el.addEventListener('mousedown', () => focusWindow(id));
    focusWindow(id);
    notifyChange();
    return id;
}

function setupDrag(el, winData) {
    const titlebar = el.querySelector('.window-titlebar');
    let dragging = false, startX, startY, origX, origY;

    titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls')) return;
        if (winData.maximized) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        origX = el.offsetLeft; origY = el.offsetTop;
        document.body.style.cursor = 'move';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        el.style.left = (origX + dx) + 'px';
        el.style.top = Math.max(0, origY + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (dragging) { dragging = false; document.body.style.cursor = ''; }
    });

    // Double-click titlebar to maximize
    titlebar.addEventListener('dblclick', (e) => {
        if (e.target.closest('.window-controls')) return;
        toggleMaximize(winData.id);
    });
}

function setupResize(el, winData) {
    const handles = el.querySelectorAll('.resize-handle');
    let resizing = false, startX, startY, origW, origH, origX, origY, direction;

    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            if (winData.maximized) return;
            resizing = true;
            direction = handle.className.replace('resize-handle ', '');
            startX = e.clientX; startY = e.clientY;
            origW = el.offsetWidth; origH = el.offsetHeight;
            origX = el.offsetLeft; origY = el.offsetTop;
            e.preventDefault(); e.stopPropagation();
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!resizing) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        let newW = origW, newH = origH, newX = origX, newY = origY;

        if (direction.includes('e')) newW = Math.max(320, origW + dx);
        if (direction.includes('w')) { newW = Math.max(320, origW - dx); newX = origX + dx; }
        if (direction.includes('s')) newH = Math.max(200, origH + dy);
        if (direction.includes('n')) { newH = Math.max(200, origH - dy); newY = origY + dy; }

        el.style.width = newW + 'px'; el.style.height = newH + 'px';
        el.style.left = newX + 'px'; el.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (resizing) {
            resizing = false;
            if (winData.onResize) winData.onResize();
        }
    });
}

function setupControls(el, winData) {
    el.querySelectorAll('.window-ctrl-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if (action === 'minimize') minimizeWindow(winData.id);
            else if (action === 'maximize') toggleMaximize(winData.id);
            else if (action === 'close') closeWindow(winData.id);
        });
    });
}

export function focusWindow(id) {
    const win = windows.get(id);
    if (!win || win.minimized) return;
    windows.forEach(w => w.el.classList.remove('focused'));
    win.el.style.zIndex = ++zIndexCounter;
    win.el.classList.add('focused');
    activeWindowId = id;
    notifyChange();
}

export function minimizeWindow(id) {
    const win = windows.get(id);
    if (!win) return;
    win.el.classList.add('minimizing');
    setTimeout(() => {
        win.el.style.display = 'none';
        win.el.classList.remove('minimizing');
        win.minimized = true;
        if (activeWindowId === id) activeWindowId = null;
        notifyChange();
    }, 250);
}

export function restoreWindow(id) {
    const win = windows.get(id);
    if (!win) return;
    if (win.minimized) {
        win.el.style.display = 'flex';
        win.minimized = false;
        win.el.style.animation = 'none';
        void win.el.offsetHeight; // force reflow
        win.el.style.animation = 'windowOpen 0.25s ease';
    }
    focusWindow(id);
    notifyChange();
}

export function toggleMaximize(id) {
    const win = windows.get(id);
    if (!win) return;
    if (win.maximized) {
        win.el.classList.remove('maximized');
        if (win.prevRect) {
            win.el.style.left = win.prevRect.left;
            win.el.style.top = win.prevRect.top;
            win.el.style.width = win.prevRect.width;
            win.el.style.height = win.prevRect.height;
        }
        win.maximized = false;
    } else {
        win.prevRect = {
            left: win.el.style.left, top: win.el.style.top,
            width: win.el.style.width, height: win.el.style.height
        };
        win.el.classList.add('maximized');
        win.maximized = true;
    }
    if (win.onResize) win.onResize();
}

export function closeWindow(id) {
    const win = windows.get(id);
    if (!win) return;
    win.el.classList.add('closing');
    setTimeout(() => {
        if (win.onClose) win.onClose();
        win.el.remove();
        windows.delete(id);
        if (activeWindowId === id) activeWindowId = null;
        notifyChange();
    }, 200);
}
