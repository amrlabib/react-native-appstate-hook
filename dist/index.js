import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

export default function useAppState(settings) {
  const { onChange, onForeground, onBackground } = settings || {};
  const [appState, setAppState] = useState(AppState.currentState);

  function handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      isValidFunction(onForeground) && onForeground();
    } else if (
      appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // to ensure that onBackground() is not called twice we
      // check if the previous app state was 'active' as iOS
      // has two not-active-states (inactive and background)
      isValidFunction(onBackground) && onBackground();
    }
    setAppState(nextAppState);
    isValidFunction(onChange) && onChange(nextAppState);
  }

  // didMount effect
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    // didUnmount effect
    return () => AppState.removeEventListener('change', handleAppStateChange);
  },[]);

  // settings validation
  function isValidFunction(func) {
    return func && typeof func === 'function';
  }

  return { appState };
}
