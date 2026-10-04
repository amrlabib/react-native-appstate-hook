# react-native-appstate-hook

A small React hook around React Native's [`AppState`](https://reactnative.dev/docs/appstate) API — know when your app goes to the foreground or background, and react to memory warnings and window focus changes, without wiring up `AppState.addEventListener`.

## Installation

```sh
npm install react-native-appstate-hook
# or
yarn add react-native-appstate-hook
```

## Usage

```jsx
import React from 'react';
import { Text, View } from 'react-native';
import useAppState from 'react-native-appstate-hook';

export default function App() {
  const { appState } = useAppState({
    onChange: (newAppState) => console.log('App state changed to', newAppState),
    onForeground: () => console.log('App came to the foreground'),
    onBackground: () => console.log('App went to the background'),
    onMemoryWarning: () => console.log('App received a memory warning'),
    onFocus: () => console.log('App window gained focus (Android only)'),
    onBlur: () => console.log('App window lost focus (Android only)'),
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>App state is: {appState}</Text>
    </View>
  );
}
```

All settings are optional — pass only the callbacks you need.

## API

### Settings

`useAppState` takes a single, optional settings object:

| Key | Type | Description |
| --- | --- | --- |
| `onChange` | `(appState: AppStateStatus) => void` | Called on every app state transition, with the new state. |
| `onForeground` | `() => void` | Called when the app transitions into the `active` state. |
| `onBackground` | `() => void` | Called when the app leaves the `active` state for `inactive` or `background`. |
| `onMemoryWarning` | `() => void` | **iOS only.** Called when the OS reports a low-memory warning. This is a point-in-time signal, not a state the app stays in — it can fire while the app is active or backgrounded. |
| `onFocus` | `() => void` | **Android only.** Called when the app's window gains OS input focus. |
| `onBlur` | `() => void` | **Android only.** Called when the app's window loses OS input focus — e.g. a system dialog or another app (split-screen/multi-window) is shown over it — *without* the app actually backgrounding. |


### Return value

| Key | Type | Description |
| --- | --- | --- |
| `appState` | `AppStateStatus` | The current app state: `active`, `background`, or `inactive` (iOS only). |


## License

MIT
