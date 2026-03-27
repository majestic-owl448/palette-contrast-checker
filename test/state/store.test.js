import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../../js/state/store.js';

describe('createStore', () => {
  const identity = (state) => state;
  const counter = (state, action) => {
    if (action.type === 'INCREMENT') return { ...state, count: state.count + 1 };
    return state;
  };

  it('returns initial state', () => {
    const store = createStore(identity, { value: 42 });
    expect(store.getState()).toEqual({ value: 42 });
  });

  it('dispatches actions through reducer', () => {
    const store = createStore(counter, { count: 0 });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().count).toBe(1);
  });

  it('notifies subscribers on dispatch', () => {
    const store = createStore(counter, { count: 0 });
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch({ type: 'INCREMENT' });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ count: 1 }, { type: 'INCREMENT' });
  });

  it('unsubscribes when returned function is called', () => {
    const store = createStore(counter, { count: 0 });
    const listener = vi.fn();
    const unsub = store.subscribe(listener);
    unsub();
    store.dispatch({ type: 'INCREMENT' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('supports multiple subscribers', () => {
    const store = createStore(counter, { count: 0 });
    const l1 = vi.fn();
    const l2 = vi.fn();
    store.subscribe(l1);
    store.subscribe(l2);
    store.dispatch({ type: 'INCREMENT' });
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });
});
