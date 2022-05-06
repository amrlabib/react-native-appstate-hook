import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

export default function useAppState(settings) {
  const { onChange, onForeground, onBackground } = settings || {};
  const [currentState, setCurrentState] = useState(AppState.currentState);

  useEffect(() => {
    function handleAppStateChange(nextAppState) {
      if (nextAppState === 'active' && currentState !== 'active') {
        isValidFunction(onForeground) && onForeground();
      } else if (currentState === 'active' && nextAppState.match(/inactive|background/)) {
        isValidFunction(onBackground) && onBackground();
      }
      setCurrentState(nextAppState);
      isValidFunction(onChange) && onChange(nextAppState);
    }
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => appStateListener.remove();
  }, [onChange, onForeground, onBackground, currentState]);

  // settings validation
  function isValidFunction(func) {
    return func && typeof func === 'function';
  }
  return { appState: currentState };
}
