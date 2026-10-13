import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  ThemeMode,
  WorkspaceSettings,
  ConnectionStatus,
} from "../types";
import { api } from "../services/api";

// ── State ────────────────────────────────────────────────────────────

interface AppState {
  settings: WorkspaceSettings;
  connection: ConnectionStatus;
  sidebarOpen: boolean;
  demoMode: boolean;
}

const savedTheme = (typeof window !== "undefined"
  ? (localStorage.getItem("evalora_theme") as ThemeMode)
  : null) || "light";

const defaultSettings: WorkspaceSettings = {
  theme: savedTheme,
  workspaceName: "My Workspace",
  defaultModels: ["gemini", "grok"],
  autoSave: true,
  notificationsEnabled: true,
};

const initialState: AppState = {
  settings: defaultSettings,
  connection: {
    connected: false,
    latencyMs: null,
    lastChecked: null,
    version: null,
  },
  sidebarOpen: true,
  demoMode: true,
};

// ── Actions ──────────────────────────────────────────────────────────

type Action =
  | { type: "SET_THEME"; payload: ThemeMode }
  | { type: "UPDATE_SETTINGS"; payload: Partial<WorkspaceSettings> }
  | { type: "SET_CONNECTION"; payload: ConnectionStatus }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; payload: boolean }
  | { type: "SET_DEMO_MODE"; payload: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        settings: { ...state.settings, theme: action.payload },
      };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case "SET_CONNECTION":
      return { ...state, connection: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_SIDEBAR":
      return { ...state, sidebarOpen: action.payload };
    case "SET_DEMO_MODE":
      return { ...state, demoMode: action.payload };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  updateSettings: (s: Partial<WorkspaceSettings>) => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  checkConnection: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTheme = useCallback((theme: ThemeMode) => {
    localStorage.setItem("evalora_theme", theme);
    dispatch({ type: "SET_THEME", payload: theme });
  }, []);

  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme: ThemeMode = isDark ? "light" : "dark";
    localStorage.setItem("evalora_theme", nextTheme);
    dispatch({ type: "SET_THEME", payload: nextTheme });
  }, []);

  const updateSettings = useCallback(
    (s: Partial<WorkspaceSettings>) =>
      dispatch({ type: "UPDATE_SETTINGS", payload: s }),
    []
  );

  const toggleSidebar = useCallback(
    () => dispatch({ type: "TOGGLE_SIDEBAR" }),
    []
  );

  const setSidebar = useCallback(
    (open: boolean) => dispatch({ type: "SET_SIDEBAR", payload: open }),
    []
  );

  const checkConnection = useCallback(async () => {
    const status = await api.getConnectionStatus();
    dispatch({ type: "SET_CONNECTION", payload: status });
    dispatch({ type: "SET_DEMO_MODE", payload: !status.connected });
  }, []);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      root.classList.remove("light", "dark");
      if (state.settings.theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.classList.add(prefersDark ? "dark" : "light");
      } else {
        root.classList.add(state.settings.theme);
      }
    };

    applyTheme();

    if (state.settings.theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", applyTheme);
      return () => mql.removeEventListener("change", applyTheme);
    }
  }, [state.settings.theme]);

  return (
    <AppContext.Provider
      value={{
        state,
        setTheme,
        toggleTheme,
        updateSettings,
        toggleSidebar,
        setSidebar,
        checkConnection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
