// ============================================
// AI OS — Main Entry Point
// ============================================
import './style.css';
import { createWindow, onWindowsChanged, getOpenWindows, focusWindow, restoreWindow, minimizeWindow } from './core/windowManager.js';
import { showNotification, welcomeNotifications } from './core/notifications.js';
import { aiEngine } from './ai/engine.js';
import { createAssistant } from './apps/assistant.js';
import { createExplorer } from './apps/explorer.js';
import { createNotepad } from './apps/notepad.js';
import { createCalculator } from './apps/calculator.js';
import { createTerminal } from './apps/terminal.js';
import { createSettings } from './apps/settings.js';
import { createWeather } from './apps/weather.js';
import { createBrowser } from './apps/browser.js';

// ============================================
// App Registry
// ============================================
const APPS = [
  { id: 'assistant', name: 'AI Assistant', icon: 'neurology', color: '#60cdff', width: 480, height: 580, factory: (c, id) => createAssistant(c) },
  { id: 'explorer', name: 'File Explorer', icon: 'folder_open', color: '#fcc419', width: 860, height: 520, factory: (c, id) => createExplorer(c) },
  { id: 'notepad', name: 'Notepad', icon: 'edit_note', color: '#74c0fc', width: 700, height: 480, factory: (c, id) => createNotepad(c, id) },
  { id: 'calculator', name: 'Calculator', icon: 'calculate', color: '#51cf66', width: 320, height: 480, factory: (c, id) => createCalculator(c) },
  { id: 'terminal', name: 'Terminal', icon: 'terminal', color: '#b4a0ff', width: 720, height: 450, factory: (c, id) => createTerminal(c) },
  { id: 'settings', name: 'Settings', icon: 'settings', color: '#8b949e', width: 820, height: 540, factory: (c, id) => createSettings(c) },
  { id: 'weather', name: 'Weather', icon: 'cloud', color: '#74c0fc', width: 440, height: 520, factory: (c, id) => createWeather(c) },
  { id: 'browser', name: 'Chrome', icon: 'chrome_reader_mode', color: '#4285F4', width: 900, height: 560, factory: (c, id) => createBrowser(c) },
];

// ============================================
// Desktop Icons
// ============================================
const DESKTOP_ICONS = [
  { appId: 'assistant', label: 'AI Assistant' },
  { appId: 'explorer', label: 'File Explorer' },
  { appId: 'notepad', label: 'Notepad' },
  { appId: 'terminal', label: 'Terminal' },
  { appId: 'browser', label: 'Chrome' },
  { appId: 'calculator', label: 'Calculator' },
  { appId: 'settings', label: 'Settings' },
  { appId: 'weather', label: 'Weather' },
];

// ============================================
// Open an app
// ============================================
function openApp(appId, extraArgs = {}) {
  const app = APPS.find(a => a.id === appId);
  if (!app) return;
  createWindow({
    title: app.name,
    icon: app.icon,
    width: app.width,
    height: app.height,
    app: appId,
    contentFactory: (contentEl, winId) => {
      if (appId === 'notepad' && extraArgs.fileName) {
        createNotepad(contentEl, winId, extraArgs.fileName, extraArgs.content, extraArgs.filePath);
      } else {
        app.factory(contentEl, winId);
      }
    },
  });
}

// Global helper for explorer → notepad opening
window.__openNotepadWithContent = (fileName, content, filePath) => {
  openApp('notepad', { fileName, content, filePath });
};

// ============================================
// Render Desktop
// ============================================
function renderDesktop() {
  const iconsContainer = document.getElementById('desktop-icons');
  iconsContainer.innerHTML = DESKTOP_ICONS.map(di => {
    const app = APPS.find(a => a.id === di.appId);
    return `
      <div class="desktop-icon" data-app="${di.appId}">
        <div class="desktop-icon-img">
          <span class="material-symbols-outlined icon-filled" style="color:${app?.color || '#fff'}">${app?.icon || 'apps'}</span>
        </div>
        <div class="desktop-icon-label">${di.label}</div>
      </div>
    `;
  }).join('');

  iconsContainer.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('dblclick', () => openApp(icon.dataset.app));
    icon.addEventListener('click', () => {
      iconsContainer.querySelectorAll('.desktop-icon.selected').forEach(el => el.classList.remove('selected'));
      icon.classList.add('selected');
    });
  });

  // Desktop right-click
  document.getElementById('desktop').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, [
      { icon: 'refresh', label: 'Refresh', action: () => { } },
      { separator: true },
      { icon: 'grid_view', label: 'View', action: () => { } },
      { icon: 'sort', label: 'Sort by', action: () => { } },
      { separator: true },
      { icon: 'add', label: 'New Folder', action: () => { } },
      { icon: 'description', label: 'New File', action: () => { } },
      { separator: true },
      { icon: 'settings', label: 'Settings', action: () => openApp('settings') },
      { icon: 'neurology', label: 'AI Assistant', action: () => openApp('assistant') },
    ]);
  });

  // Click anywhere to deselect & close menus
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.desktop-icon')) {
      iconsContainer.querySelectorAll('.desktop-icon.selected').forEach(el => el.classList.remove('selected'));
    }
    if (!e.target.closest('#context-menu')) {
      document.getElementById('context-menu').classList.remove('visible');
    }
  });
}

// ============================================
// Context Menu
// ============================================
function showContextMenu(x, y, items) {
  const menu = document.getElementById('context-menu');
  menu.innerHTML = items.map(item => {
    if (item.separator) return '<div class="ctx-separator"></div>';
    return `<div class="ctx-item" data-id="${item.label}">
      <span class="material-symbols-outlined">${item.icon}</span>
      <span class="ctx-item-label">${item.label}</span>
      ${item.shortcut ? `<span class="ctx-item-shortcut">${item.shortcut}</span>` : ''}
    </div>`;
  }).join('');

  menu.style.left = Math.min(x, window.innerWidth - 220) + 'px';
  menu.style.top = Math.min(y, window.innerHeight - menu.offsetHeight - 60) + 'px';
  menu.classList.add('visible');

  menu.querySelectorAll('.ctx-item').forEach((el, i) => {
    const realItems = items.filter(it => !it.separator);
    const item = realItems[i];
    if (item?.action) el.addEventListener('click', () => { item.action(); menu.classList.remove('visible'); });
  });
}

// ============================================
// Render Taskbar
// ============================================
function renderTaskbar() {
  const taskbar = document.getElementById('taskbar');
  taskbar.innerHTML = `
    <div class="taskbar-start" id="btn-start" style="padding: 6px;">
      <img src="/logo.png" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;">
    </div>
    <div class="taskbar-search" id="btn-search">
      <span class="material-symbols-outlined">search</span>
      <span>Search apps, files, settings...</span>
    </div>
    <div class="taskbar-apps" id="taskbar-apps"></div>
    <div class="taskbar-tray">
      <div class="tray-btn"><span class="material-symbols-outlined">wifi</span></div>
      <div class="tray-btn"><span class="material-symbols-outlined">volume_up</span></div>
      <div class="tray-btn"><span class="material-symbols-outlined">battery_full</span></div>
    </div>
    <div class="taskbar-clock" id="taskbar-clock">
      <div class="taskbar-clock-time"></div>
      <div class="taskbar-clock-date"></div>
    </div>
  `;

  // Start button
  document.getElementById('btn-start').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStartMenu();
  });

  // Search
  document.getElementById('btn-search').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStartMenu(true);
  });

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Update taskbar apps display
  onWindowsChanged(updateTaskbarApps);
}

function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById('taskbar-clock');
  if (!clockEl) return;
  clockEl.querySelector('.taskbar-clock-time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  clockEl.querySelector('.taskbar-clock-date').textContent = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function updateTaskbarApps(openWindows) {
  const container = document.getElementById('taskbar-apps');
  if (!container) return;
  container.innerHTML = openWindows.map(win => {
    const app = APPS.find(a => a.id === win.app) || {};
    return `
      <div class="taskbar-app ${win.active ? 'active' : ''}" data-win-id="${win.id}" title="${win.title}">
        <span class="material-symbols-outlined" style="color:${app.color || '#fff'}">${win.icon}</span>
        <div class="taskbar-app-indicator"></div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.taskbar-app').forEach(el => {
    el.addEventListener('click', () => {
      const winId = el.dataset.winId;
      const win = openWindows.find(w => w.id === winId);
      if (win) {
        if (win.active && !win.minimized) minimizeWindow(winId);
        else restoreWindow(winId);
      }
    });
  });
}

// ============================================
// Start Menu
// ============================================
let startMenuOpen = false;

function renderStartMenu() {
  const menu = document.getElementById('start-menu');
  const pinnedApps = APPS;

  menu.innerHTML = `
    <div class="start-search">
      <div class="start-search-box">
        <span class="material-symbols-outlined">search</span>
        <input type="text" class="start-search-input" id="start-search-input" placeholder="Type to search apps, files, settings...">
      </div>
    </div>
    <div class="start-section">
      <div class="start-section-header">
        <span class="start-section-title">Pinned</span>
        <span class="start-section-action">All apps ›</span>
      </div>
      <div class="start-pinned-grid" id="start-pinned-grid">
        ${pinnedApps.map(app => `
          <div class="start-app-item" data-app="${app.id}">
            <div class="start-app-icon"><span class="material-symbols-outlined icon-filled" style="color:${app.color}">${app.icon}</span></div>
            <div class="start-app-name">${app.name}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="start-section">
      <div class="start-section-header">
        <span class="start-section-title">Recommended</span>
      </div>
      <div class="start-recommended-list">
        <div class="start-recommended-item" data-app="notepad">
          <div class="start-recommended-icon"><span class="material-symbols-outlined">description</span></div>
          <div class="start-recommended-info">
            <div class="start-recommended-name">Welcome.txt</div>
            <div class="start-recommended-detail">Recently opened</div>
          </div>
        </div>
        <div class="start-recommended-item" data-app="assistant">
          <div class="start-recommended-icon"><span class="material-symbols-outlined">neurology</span></div>
          <div class="start-recommended-info">
            <div class="start-recommended-name">Ask AI Assistant</div>
            <div class="start-recommended-detail">Get help with anything</div>
          </div>
        </div>
        <div class="start-recommended-item" data-app="terminal">
          <div class="start-recommended-icon"><span class="material-symbols-outlined">terminal</span></div>
          <div class="start-recommended-info">
            <div class="start-recommended-name">Open Terminal</div>
            <div class="start-recommended-detail">Run commands</div>
          </div>
        </div>
      </div>
    </div>
    <div class="start-footer">
      <div class="start-user">
        <div class="start-user-avatar">U</div>
        <div class="start-user-name">User</div>
      </div>
      <div class="start-power" id="start-power" title="Shut Down">
        <span class="material-symbols-outlined">power_settings_new</span>
      </div>
    </div>
  `;

  // Open app from start menu
  menu.querySelectorAll('.start-app-item, .start-recommended-item').forEach(item => {
    item.addEventListener('click', () => {
      openApp(item.dataset.app);
      toggleStartMenu(false);
    });
  });

  // Search
  const searchInput = menu.querySelector('#start-search-input');
  searchInput.addEventListener('input', () => {
    const results = aiEngine.searchApps(searchInput.value);
    const grid = menu.querySelector('#start-pinned-grid');
    grid.innerHTML = results.map(app => `
      <div class="start-app-item" data-app="${app.id}">
        <div class="start-app-icon"><span class="material-symbols-outlined icon-filled" style="color:${APPS.find(a => a.id === app.id)?.color || '#fff'}">${app.icon}</span></div>
        <div class="start-app-name">${app.name}</div>
      </div>
    `).join('');
    grid.querySelectorAll('.start-app-item').forEach(item => {
      item.addEventListener('click', () => { openApp(item.dataset.app); toggleStartMenu(false); });
    });
  });

  // Power button — show boot screen effect
  menu.querySelector('#start-power')?.addEventListener('click', () => {
    toggleStartMenu(false);
    document.getElementById('os-root').style.display = 'none';
    const boot = document.getElementById('boot-screen');
    boot.style.display = 'flex';
    boot.querySelector('.boot-status').textContent = 'Shutting down...';
    boot.querySelector('.boot-progress-bar').style.animation = 'none';
    boot.querySelector('.boot-progress-bar').style.width = '100%';
    setTimeout(() => {
      boot.querySelector('.boot-status').textContent = 'Restarting...';
      setTimeout(() => location.reload(), 1500);
    }, 2000);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (startMenuOpen && !e.target.closest('#start-menu') && !e.target.closest('#btn-start') && !e.target.closest('#btn-search')) {
      toggleStartMenu(false);
    }
  });
}

function toggleStartMenu(forceOpen) {
  const menu = document.getElementById('start-menu');
  if (forceOpen === true) startMenuOpen = true;
  else if (forceOpen === false) startMenuOpen = false;
  else startMenuOpen = !startMenuOpen;

  if (startMenuOpen) {
    menu.classList.add('open');
    setTimeout(() => {
      const searchInput = menu.querySelector('#start-search-input');
      if (searchInput) searchInput.focus();
    }, 300);
  } else {
    menu.classList.remove('open');
  }
}

// ============================================
// Boot Sequence
// ============================================
function bootSequence() {
  const bootScreen = document.getElementById('boot-screen');
  const lockScreen = document.getElementById('lock-screen');
  const osRoot = document.getElementById('os-root');
  const statusEl = bootScreen.querySelector('.boot-status');

  const bootMessages = [
    'Initializing system...',
    'Loading AI Engine...',
    'Starting window manager...',
    'Loading applications...',
    'Preparing desktop...',
    'Ready!'
  ];

  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx++;
    if (msgIdx < bootMessages.length) {
      statusEl.textContent = bootMessages[msgIdx];
    }
  }, 450);

  // After boot progress
  setTimeout(() => {
    clearInterval(msgInterval);
    bootScreen.style.transition = 'opacity 0.5s ease';
    bootScreen.style.opacity = '0';

    setTimeout(() => {
      bootScreen.style.display = 'none';
      lockScreen.style.display = 'flex';
      updateLockClock();

      // Update lock screen clock
      const lockClockInterval = setInterval(updateLockClock, 1000);

      // Click to unlock
      lockScreen.addEventListener('click', () => {
        clearInterval(lockClockInterval);
        lockScreen.classList.add('unlocking');
        setTimeout(() => {
          lockScreen.style.display = 'none';
          osRoot.style.display = 'block';
          initOS();
        }, 600);
      });
    }, 500);
  }, 2800);
}

function updateLockClock() {
  const now = new Date();
  document.getElementById('lock-time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('lock-date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ============================================
// Initialize OS
// ============================================
function initOS() {
  renderDesktop();
  renderTaskbar();
  renderStartMenu();
  welcomeNotifications();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Win/Meta key or Escape to toggle start menu
    if (e.key === 'Meta' || (e.key === 'Escape' && startMenuOpen)) {
      e.preventDefault();
      toggleStartMenu();
    }
  });
}

// ============================================
// Start!
// ============================================
document.addEventListener('DOMContentLoaded', bootSequence);
