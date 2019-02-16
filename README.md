## react-native-appstate-hook

React Native appState hook is a custom [react hook](https://reactjs.org/docs/hooks-intro.html), built to handle iOS or Android `appState` in your react component

#### Note:

React hooks is available from react version 16.8.0 and react native version 0.59.0

---

## Setup

`yarn add react-native-appstate-hook`

OR

`npm install --save react-native-appstate-hook`

---

## Example

```javascript
import React from 'react';
import { Text, View } from 'react-native';
import useAppState from 'react-native-appstate-hook';


export default function App() {
  const { appState } = useAppState({
    onChange: (newAppState) => console.warn('App state changed to ', newAppState),
    onForeground: () => console.warn('App went to Foreground'),
    onBackground: () => console.warn('App went to background'),
  });

  return (
    <View style={{textAlign: 'center', backgroundColor :'white', flex: 1, justifyContent: 'center'}}>
      <Text>App State is: {appState}</Text>
    </View>
  );
}


```

---

## Settings

| key | Type | Required | Description |
| --- | --- | --- | ---- |
| onChange | Function | No | callback function to be executed once `appState` is changed |
| onForeground | Function | No | callback function to be executed once app go to foreground |
| onBackground | Function | No | callback function to be executed once app go to background |

---

## Values

| key | Type | Description |
| --- | --- | ---- |
| appState | string | app state it can be one of the following values `active`, `inactive`, or `background` |
