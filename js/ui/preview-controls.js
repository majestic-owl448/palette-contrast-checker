/**
 * Preview controls — font picker, size slider, text input.
 */

import { savePreferences } from '../state/persistence.js';

export function initPreviewControls(store) {
  const textInput = document.getElementById('preview-text-input');
  const fontSelect = document.getElementById('font-family-select');
  const sizeSlider = document.getElementById('font-size-slider');
  const sizeValue = document.getElementById('font-size-value');

  // Restore from state
  const { preferences } = store.getState();
  textInput.value = preferences.previewText;
  fontSelect.value = preferences.fontFamily;
  sizeSlider.value = preferences.fontSize;
  sizeValue.textContent = preferences.fontSize;

  textInput.addEventListener('input', () => {
    store.dispatch({ type: 'SET_PREVIEW_TEXT', payload: textInput.value });
    persistPrefs(store);
  });

  fontSelect.addEventListener('change', () => {
    store.dispatch({ type: 'SET_FONT_FAMILY', payload: fontSelect.value });
    persistPrefs(store);
  });

  sizeSlider.addEventListener('input', () => {
    sizeValue.textContent = sizeSlider.value;
    store.dispatch({ type: 'SET_FONT_SIZE', payload: parseInt(sizeSlider.value, 10) });
    persistPrefs(store);
  });
}

function persistPrefs(store) {
  savePreferences(store.getState().preferences);
}
