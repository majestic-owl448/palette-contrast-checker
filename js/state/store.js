/**
 * Minimal pub/sub state container.
 * No framework dependency — just dispatch, getState, subscribe.
 */

export function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    for (const listener of listeners) {
      listener(state, action);
    }
    return state;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, dispatch, subscribe };
}
