import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

export default function useAppState(settings) {
  const { onChange, onForeground, onBackground } = settings || {};
  const [appState, setAppState] = useState(AppState.currentState);

  function handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      isValidFunction(onForeground) && onForeground();
    } else if(nextAppState.match(/inactive|background/)) {
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
