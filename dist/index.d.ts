declare module "react-native-appstate-hook" {
  import { AppStateStatus } from "react-native";

  export interface AppStateHookSettings {
    onChange?: (status: AppStateStatus) => void;
    onForeground?: () => void;
    onBackground?: () => void;
  }

  export interface AppStateHookResult {
    appState: AppStateStatus;
  }

  function useAppState(settings?: AppStateHookSettings): AppStateHookResult;

  export default useAppState;
}
