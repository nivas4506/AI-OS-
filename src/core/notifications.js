// ============================================
// Notification System
// ============================================

const container = () => document.getElementById('notifications-container');

export function showNotification({ title, message, icon, duration = 5000 }) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `
    <div class="notification-icon">
      <span class="material-symbols-outlined">${icon || 'notifications'}</span>
    </div>
    <div class="notification-body">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
      <div class="notification-time">Just now</div>
    </div>
  `;

    notif.addEventListener('click', () => dismiss(notif));
    container().appendChild(notif);

    if (duration > 0) {
        setTimeout(() => dismiss(notif), duration);
    }
    return notif;
}

function dismiss(notif) {
    if (!notif || !notif.parentNode) return;
    notif.classList.add('removing');
    setTimeout(() => notif.remove(), 300);
}

export function welcomeNotifications() {
    setTimeout(() => {
        showNotification({
            title: 'AI OS',
            message: 'Welcome! Your intelligent desktop is ready.',
            icon: 'neurology',
            duration: 6000,
        });
    }, 1500);

    setTimeout(() => {
        showNotification({
            title: 'AI Assistant',
            message: 'Say "Hello" to get started with your AI Assistant!',
            icon: 'smart_toy',
            duration: 8000,
        });
    }, 4000);
}
