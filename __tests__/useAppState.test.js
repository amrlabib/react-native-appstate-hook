import { renderHook, act } from '@testing-library/react-native';

jest.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
  },
}));

import { AppState } from 'react-native';
import useAppState from '../dist/index';

describe('useAppState', () => {
  let listenersByType;

  beforeEach(() => {
    listenersByType = {};
    AppState.currentState = 'active';
    AppState.addEventListener.mockReset();
    AppState.addEventListener.mockImplementation((type, handler) => {
      listenersByType[type] = listenersByType[type] || [];
      listenersByType[type].push(handler);
      return { remove: jest.fn() };
    });
  });

  function emit(type, payload) {
    act(() => {
      (listenersByType[type] || []).forEach((handler) => handler(payload));
    });
  }

  function subscriptionFor(type) {
    const callIndex = AppState.addEventListener.mock.calls.findIndex((call) => call[0] === type);
    return AppState.addEventListener.mock.results[callIndex].value;
  }

  test('returns the current app state on mount', () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.appState).toBe('active');
  });

  test('calls onBackground when leaving the active state', () => {
    const onBackground = jest.fn();
    renderHook(() => useAppState({ onBackground }));
    emit('change', 'background');
    expect(onBackground).toHaveBeenCalledTimes(1);
  });

  test('calls onForeground only when returning to the active state', () => {
    const onForeground = jest.fn();
    renderHook(() => useAppState({ onForeground }));
    emit('change', 'active');
    expect(onForeground).not.toHaveBeenCalled();

    emit('change', 'background');
    emit('change', 'active');
    expect(onForeground).toHaveBeenCalledTimes(1);
  });

  test('calls onChange on every transition', () => {
    const onChange = jest.fn();
    renderHook(() => useAppState({ onChange }));
    emit('change', 'background');
    emit('change', 'active');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'background');
    expect(onChange).toHaveBeenNthCalledWith(2, 'active');
  });

  test('calls onMemoryWarning when the OS reports low memory', () => {
    const onMemoryWarning = jest.fn();
    renderHook(() => useAppState({ onMemoryWarning }));
    emit('memoryWarning');
    expect(onMemoryWarning).toHaveBeenCalledTimes(1);
  });

  test('calls onFocus when the app window gains OS focus (Android)', () => {
    const onFocus = jest.fn();
    renderHook(() => useAppState({ onFocus }));
    emit('focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  test('calls onBlur when the app window loses OS focus (Android)', () => {
    const onBlur = jest.fn();
    renderHook(() => useAppState({ onBlur }));
    emit('blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('subscribes once per mount to each event and unsubscribes all on unmount', () => {
    const { unmount } = renderHook(() => useAppState());
    emit('change', 'background');
    emit('change', 'active');

    const subscribedTypes = AppState.addEventListener.mock.calls.map((call) => call[0]);
    expect(subscribedTypes.sort()).toEqual(['blur', 'change', 'focus', 'memoryWarning']);

    const subscriptions = subscribedTypes.map((type) => subscriptionFor(type));
    unmount();
    subscriptions.forEach((subscription) => expect(subscription.remove).toHaveBeenCalledTimes(1));
  });

  test('does not resubscribe when new inline callbacks are passed on every render', () => {
    const { rerender } = renderHook(
      ({ onChange }) => useAppState({ onChange }),
      { initialProps: { onChange: () => {} } }
    );
    rerender({ onChange: () => {} });
    rerender({ onChange: () => {} });
    rerender({ onChange: () => {} });

    expect(AppState.addEventListener).toHaveBeenCalledTimes(4);
  });

  test('still invokes the latest callback after a re-render with a new reference', () => {
    const firstOnChange = jest.fn();
    const secondOnChange = jest.fn();
    const { rerender } = renderHook(
      ({ onChange }) => useAppState({ onChange }),
      { initialProps: { onChange: firstOnChange } }
    );
    rerender({ onChange: secondOnChange });

    emit('change', 'background');
    expect(firstOnChange).not.toHaveBeenCalled();
    expect(secondOnChange).toHaveBeenCalledWith('background');
  });
});
