/**
 * Application bootstrap.
 * Initializes the store, checks for recovery/URL state, and wires up all UI modules.
 */

import { createStore } from '../state/store.js';
import { reducer, getInitialState, generateId, resetIdCounter } from '../state/actions.js';
import { loadWip, loadPreferences } from '../state/persistence.js';
import { decodePaletteFromHash } from '../lib/palette-url.js';
import { initPaletteEditor } from './palette-editor.js';
import { initAnalysisRunner } from './analysis-runner.js';
import { initResultsView } from './results-view.js';
import { initResultsFilter } from './results-filter.js';
import { initPreviewControls } from './preview-controls.js';
import { initSuggestionsPanel } from './suggestions-panel.js';
import { initStoragePanel } from './storage-panel.js';
import { initAlerts } from './alerts.js';
import { initDragReorder } from './drag-reorder.js';

export let store;

export function getStore() {
  return store;
}

export function initApp() {
  const initialState = getInitialState();

  // Restore preferences
  const savedPrefs = loadPreferences();
  if (savedPrefs) {
    initialState.preferences = { ...initialState.preferences, ...savedPrefs };
  }

  store = createStore(reducer, initialState);

  // Check URL hash for shared palette
  const hashPalette = decodePaletteFromHash(window.location.hash);
  if (hashPalette && hashPalette.length > 0) {
    const colors = hashPalette.map((c) => ({
      id: generateId(),
      hex: c.hex,
      displayLabel: c.displayLabel,
      originalInputs: [c.displayLabel],
      sourceType: 'url-import',
    }));
    store.dispatch({ type: 'LOAD_PALETTE', payload: colors });
    // Clear hash so it doesn't interfere with future navigation
    history.replaceState(null, '', window.location.pathname);
  } else {
    // Check for WIP recovery
    const wip = loadWip();
    if (wip && wip.length > 0) {
      // Find the max ID in saved palette to avoid collisions
      let maxId = 0;
      for (const c of wip) {
        const n = parseInt(c.id, 10);
        if (!isNaN(n) && n > maxId) maxId = n;
      }
      resetIdCounter(maxId + 1);

      store.dispatch({
        type: 'SET_RECOVERY_AVAILABLE',
        payload: true,
      });
      initRecoveryBanner(wip);
    }
  }

  // Initialize all UI modules
  initPaletteEditor(store);
  initAnalysisRunner(store);
  initResultsView(store);
  initResultsFilter(store);
  initPreviewControls(store);
  initSuggestionsPanel(store);
  initStoragePanel(store);
  initAlerts(store);
  initDragReorder(store);
}

function initRecoveryBanner(wipPalette) {
  const banner = document.getElementById('recovery-banner');
  const restoreBtn = document.getElementById('recovery-restore-btn');
  const dismissBtn = document.getElementById('recovery-dismiss-btn');

  banner.hidden = false;

  restoreBtn.addEventListener('click', () => {
    store.dispatch({ type: 'LOAD_PALETTE', payload: wipPalette });
    store.dispatch({ type: 'SET_RECOVERY_AVAILABLE', payload: false });
    banner.hidden = true;
  });

  dismissBtn.addEventListener('click', () => {
    store.dispatch({ type: 'SET_RECOVERY_AVAILABLE', payload: false });
    banner.hidden = true;
  });
}
