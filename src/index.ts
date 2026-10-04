import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface AppStateHookSettings {
  onChange?: (appState: AppStateStatus) => void;
  onForeground?: () => void;
  onBackground?: () => void;
  onMemoryWarning?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface AppStateHookResult {
  appState: AppStateStatus;
}

function isValidFunction<T extends (...args: never[]) => void>(func: T | undefined): func is T {
  return typeof func === 'function';
}

export default function useAppState(settings?: AppStateHookSettings): AppStateHookResult {
  const { onChange, onForeground, onBackground, onMemoryWarning, onFocus, onBlur } = settings || {};
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const appStateRef = useRef(appState);

  const callbacksRef = useRef<AppStateHookSettings>({});
  callbacksRef.current = { onChange, onForeground, onBackground, onMemoryWarning, onFocus, onBlur };

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      const previousAppState = appStateRef.current;
      if (nextAppState === 'active' && previousAppState !== 'active') {
        isValidFunction(callbacksRef.current.onForeground) && callbacksRef.current.onForeground();
      } else if (previousAppState === 'active' && nextAppState.match(/inactive|background/)) {
        isValidFunction(callbacksRef.current.onBackground) && callbacksRef.current.onBackground();
      }
      appStateRef.current = nextAppState;
      setAppState(nextAppState);
      isValidFunction(callbacksRef.current.onChange) && callbacksRef.current.onChange(nextAppState);
    }

    function handleMemoryWarning() {
      isValidFunction(callbacksRef.current.onMemoryWarning) && callbacksRef.current.onMemoryWarning();
    }

    function handleFocus() {
      isValidFunction(callbacksRef.current.onFocus) && callbacksRef.current.onFocus();
    }

    function handleBlur() {
      isValidFunction(callbacksRef.current.onBlur) && callbacksRef.current.onBlur();
    }

    const changeSubscription = AppState.addEventListener('change', handleAppStateChange);
    const memoryWarningSubscription = AppState.addEventListener('memoryWarning', handleMemoryWarning);
    const focusSubscription = AppState.addEventListener('focus', handleFocus);
    const blurSubscription = AppState.addEventListener('blur', handleBlur);

    return () => {
      changeSubscription?.remove();
      memoryWarningSubscription?.remove();
      focusSubscription?.remove();
      blurSubscription?.remove();
    };
  }, []);

  return { appState };
}
