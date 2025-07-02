import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Control Room State Types
export interface ControlRoomSettings {
  // General Settings
  language: "ar" | "en" | "fr";
  darkMode: boolean;
  knouxFlavor: "professional" | "casual" | "badass";

  // Intelligence Settings
  aiAssistantLevel: "basic" | "advanced" | "genius";
  responseStyle: "formal" | "friendly" | "witty";
  contentFilter: "strict" | "moderate" | "off";

  // Performance Settings
  turboMode: boolean;
  restMode: boolean;
  resourceOptimization: boolean;

  // Visual Effects
  neonGlow: number; // 0-100
  animations: boolean;
  shadows: boolean;
  glassmorphism: number; // 0-100

  // Privacy Settings
  trackingBlock: boolean;
  localStorage: boolean;
  dataExport: boolean;
}

export interface ControlRoomState {
  settings: ControlRoomSettings;
  isInitialized: boolean;
  activeVoiceAssistant: boolean;
  previewChanges: Partial<ControlRoomSettings>;
  notifications: Array<{
    id: string;
    type: "success" | "warning" | "error" | "info";
    message: string;
    timestamp: number;
  }>;
}

// Default Settings
const defaultSettings: ControlRoomSettings = {
  language: "en",
  darkMode: true,
  knouxFlavor: "badass",
  aiAssistantLevel: "genius",
  responseStyle: "witty",
  contentFilter: "moderate",
  turboMode: false,
  restMode: false,
  resourceOptimization: true,
  neonGlow: 80,
  animations: true,
  shadows: true,
  glassmorphism: 75,
  trackingBlock: true,
  localStorage: true,
  dataExport: true,
};

const initialState: ControlRoomState = {
  settings: defaultSettings,
  isInitialized: false,
  activeVoiceAssistant: false,
  previewChanges: {},
  notifications: [],
};

// Action Types
export type ControlRoomAction =
  | { type: "INITIALIZE_ROOM" }
  | { type: "UPDATE_SETTING"; setting: keyof ControlRoomSettings; value: any }
  | { type: "BATCH_UPDATE_SETTINGS"; settings: Partial<ControlRoomSettings> }
  | { type: "PREVIEW_SETTING"; setting: keyof ControlRoomSettings; value: any }
  | { type: "APPLY_PREVIEW" }
  | { type: "CANCEL_PREVIEW" }
  | { type: "TRIGGER_VOICE_ASSISTANT" }
  | { type: "TOGGLE_TURBO_MODE" }
  | { type: "RESET_TO_DEFAULTS" }
  | { type: "LOAD_FROM_STORAGE" }
  | { type: "EXPORT_SETTINGS" }
  | {
      type: "ADD_NOTIFICATION";
      notification: {
        type: "success" | "warning" | "error" | "info";
        message: string;
      };
    }
  | { type: "REMOVE_NOTIFICATION"; id: string };

// Reducer
function controlRoomReducer(
  state: ControlRoomState,
  action: ControlRoomAction,
): ControlRoomState {
  switch (action.type) {
    case "INITIALIZE_ROOM":
      // Load settings from localStorage if available
      const storedSettings = localStorage.getItem(
        "knoux-control-room-settings",
      );
      const loadedSettings = storedSettings
        ? JSON.parse(storedSettings)
        : defaultSettings;

      return {
        ...state,
        settings: { ...defaultSettings, ...loadedSettings },
        isInitialized: true,
      };

    case "UPDATE_SETTING":
      const newSettings = {
        ...state.settings,
        [action.setting]: action.value,
      };

      // Save to localStorage
      localStorage.setItem(
        "knoux-control-room-settings",
        JSON.stringify(newSettings),
      );

      return {
        ...state,
        settings: newSettings,
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            type: "success",
            message: `Setting ${action.setting} updated successfully`,
            timestamp: Date.now(),
          },
        ],
      };

    case "BATCH_UPDATE_SETTINGS":
      const batchUpdatedSettings = {
        ...state.settings,
        ...action.settings,
      };

      localStorage.setItem(
        "knoux-control-room-settings",
        JSON.stringify(batchUpdatedSettings),
      );

      return {
        ...state,
        settings: batchUpdatedSettings,
      };

    case "PREVIEW_SETTING":
      return {
        ...state,
        previewChanges: {
          ...state.previewChanges,
          [action.setting]: action.value,
        },
      };

    case "APPLY_PREVIEW":
      const previewedSettings = {
        ...state.settings,
        ...state.previewChanges,
      };

      localStorage.setItem(
        "knoux-control-room-settings",
        JSON.stringify(previewedSettings),
      );

      return {
        ...state,
        settings: previewedSettings,
        previewChanges: {},
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            type: "success",
            message: "Preview changes applied successfully",
            timestamp: Date.now(),
          },
        ],
      };

    case "CANCEL_PREVIEW":
      return {
        ...state,
        previewChanges: {},
      };

    case "TRIGGER_VOICE_ASSISTANT":
      return {
        ...state,
        activeVoiceAssistant: !state.activeVoiceAssistant,
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            type: "info",
            message: state.activeVoiceAssistant
              ? "Voice assistant deactivated"
              : "أبو ريتاج: أهلاً وسهلاً! كيف يمكنني مساعدتك؟",
            timestamp: Date.now(),
          },
        ],
      };

    case "TOGGLE_TURBO_MODE":
      const turboMode = !state.settings.turboMode;
      const turboSettings = {
        ...state.settings,
        turboMode,
        // Auto-enable optimizations in turbo mode
        resourceOptimization: turboMode,
        neonGlow: turboMode ? 100 : state.settings.neonGlow,
      };

      localStorage.setItem(
        "knoux-control-room-settings",
        JSON.stringify(turboSettings),
      );

      return {
        ...state,
        settings: turboSettings,
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            type: turboMode ? "success" : "info",
            message: turboMode
              ? "🚀 Turbo Mode ACTIVATED! Maximum performance enabled!"
              : "Turbo Mode disabled. Back to normal operations.",
            timestamp: Date.now(),
          },
        ],
      };

    case "RESET_TO_DEFAULTS":
      localStorage.setItem(
        "knoux-control-room-settings",
        JSON.stringify(defaultSettings),
      );

      return {
        ...state,
        settings: defaultSettings,
        previewChanges: {},
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            type: "warning",
            message: "Settings reset to defaults",
            timestamp: Date.now(),
          },
        ],
      };

    case "LOAD_FROM_STORAGE":
      const loadedStorageSettings = localStorage.getItem(
        "knoux-control-room-settings",
      );
      if (loadedStorageSettings) {
        const parsedSettings = JSON.parse(loadedStorageSettings);
        return {
          ...state,
          settings: { ...defaultSettings, ...parsedSettings },
        };
      }
      return state;

    case "EXPORT_SETTINGS":
      const settingsBlob = new Blob([JSON.stringify(state.settings, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(settingsBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "knoux-control-room-settings.json";
      a.click();
      URL.revokeObjectURL(url);

      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            type: "success",
            message: "Settings exported successfully",
            timestamp: Date.now(),
          },
        ],
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            ...action.notification,
            timestamp: Date.now(),
          },
        ],
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };

    default:
      return state;
  }
}

// Context
const ControlRoomContext = createContext<{
  state: ControlRoomState;
  dispatch: React.Dispatch<ControlRoomAction>;
} | null>(null);

// Provider
export const ControlRoomProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(controlRoomReducer, initialState);

  return (
    <ControlRoomContext.Provider value={{ state, dispatch }}>
      {children}
    </ControlRoomContext.Provider>
  );
};

// Hook
export const useControlRoom = () => {
  const context = useContext(ControlRoomContext);
  if (!context) {
    throw new Error("useControlRoom must be used within ControlRoomProvider");
  }
  return context;
};

// Helper functions
export const getSettingValue = (
  state: ControlRoomState,
  setting: keyof ControlRoomSettings,
) => {
  return state.previewChanges[setting] ?? state.settings[setting];
};

export const getKnouxPersonality = (
  flavor: ControlRoomSettings["knouxFlavor"],
) => {
  const personalities = {
    professional: {
      greeting: "Welcome to your professional workspace.",
      style: "Formal and efficient",
      colors: ["#0066CC", "#003366"],
    },
    casual: {
      greeting: "Hey there! Ready to get creative?",
      style: "Friendly and approachable",
      colors: ["#00AA88", "#004455"],
    },
    badass: {
      greeting: "يلا نشتغل! وقت نعمل سحر تقني 🔥",
      style: "Bold and confident",
      colors: ["#FF3366", "#CC0033"],
    },
  };

  return personalities[flavor];
};
