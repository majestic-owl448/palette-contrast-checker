/**
 * Alerts — missing coverage warnings and general notifications.
 */

export function initAlerts(store) {
  const container = document.getElementById('alerts-container');

  function render() {
    const { ui } = store.getState();
    container.innerHTML = '';

    if (!ui.alerts || ui.alerts.length === 0) return;

    for (const message of ui.alerts) {
      const div = document.createElement('div');
      div.className = 'alert alert-warning';
      div.setAttribute('role', 'alert');
      div.innerHTML = `<span aria-hidden="true">&#9888;</span> <span>${escapeHtml(message)}</span>`;
      container.appendChild(div);
    }
  }

  store.subscribe(render);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
