import { useState } from "react";
import { Header } from "../../components/layout/Header";
import {
  Card,
  Button,
  Input,
  Toggle,
  Badge,
} from "../../components/ui";
import {
  Settings as SettingsIcon,
  Server,
  Key,
  Sun,
  Moon,
  Laptop,
  RefreshCw,
  Check,
  Save,
  CheckCircle2,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import type { ModelId, ThemeMode } from "../../types";

export default function SettingsPage() {
  const { state, updateSettings, setTheme, checkConnection } = useApp();

  // Local form state
  const [workspaceName, setWorkspaceName] = useState(
    state.settings.workspaceName
  );
  const [autoSave, setAutoSave] = useState(state.settings.autoSave);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    state.settings.notificationsEnabled
  );
  const [defaultModels, setDefaultModels] = useState<ModelId[]>(
    state.settings.defaultModels
  );
  const [geminiKey, setGeminiKey] = useState(
    () => localStorage.getItem("evalora_gemini_key") ?? "••••••••••••••••••••••••••••••••"
  );
  const [grokKey, setGrokKey] = useState(
    () => localStorage.getItem("evalora_grok_key") ?? "••••••••••••••••••••••••••••••••"
  );
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showGrokKey, setShowGrokKey] = useState(false);
  const [sensitivity, setSensitivity] = useState("0.75");
  const [apiUrl, setApiUrl] = useState(
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1"
  );

  const [checkingConnection, setCheckingConnection] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleModelToggle(model: ModelId) {
    if (defaultModels.includes(model)) {
      if (defaultModels.length > 1) {
        setDefaultModels(defaultModels.filter((m) => m !== model));
      }
    } else {
      setDefaultModels([...defaultModels, model]);
    }
  }

  async function handleTestConnection() {
    setCheckingConnection(true);
    try {
      await checkConnection();
    } finally {
      setCheckingConnection(false);
    }
  }

  function handleSaveAll() {
    updateSettings({
      workspaceName,
      autoSave,
      notificationsEnabled,
      defaultModels,
    });
    if (!geminiKey.includes("••••")) {
      localStorage.setItem("evalora_gemini_key", geminiKey);
    }
    if (!grokKey.includes("••••")) {
      localStorage.setItem("evalora_grok_key", grokKey);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  return (
    <div className="space-y-6">
      <Header
        title="Settings"
        subtitle="Manage workspace preferences, AI model access, and API backend connectivity"
        actions={
          <Button
            icon={saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            variant={saveSuccess ? "secondary" : "primary"}
            onClick={handleSaveAll}
          >
            {saveSuccess ? "Settings Saved!" : "Save Changes"}
          </Button>
        }
      />

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Workspace configurations and model credentials updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workspace Configuration */}
        <Card padding="md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Workspace Preferences
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                General settings for your evaluation workspace
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label="Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Acme AI Safety Lab"
            />

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Auto-Save Evaluations
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically save ongoing evaluation runs to history
                </p>
              </div>
              <Toggle checked={autoSave} onChange={setAutoSave} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Real-time Notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Alert on high-severity hallucination detection
                </p>
              </div>
              <Toggle
                checked={notificationsEnabled}
                onChange={setNotificationsEnabled}
              />
            </div>
          </div>
        </Card>

        {/* Backend & Connectivity */}
        <Card padding="md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Backend Connection
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                FastAPI verification service status
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    state.connection.connected
                      ? "bg-emerald-500 shadow-sm shadow-emerald-200"
                      : "bg-amber-500 shadow-sm shadow-amber-200"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {state.connection.connected
                      ? "FastAPI Backend Connected"
                      : "Demo Mode Active (Fallback)"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {state.connection.connected
                      ? `Latency: ${state.connection.latencyMs ?? 0}ms · Version: ${
                          state.connection.version ?? "1.0.0"
                        }`
                      : "Using local mock client with realistic evaluation data"}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<RefreshCw className={`w-3.5 h-3.5 ${checkingConnection ? "animate-spin" : ""}`} />}
                onClick={handleTestConnection}
                loading={checkingConnection}
              >
                Test
              </Button>
            </div>

            <Input
              label="API Base URL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000/api/v1"
            />

            <div className="text-xs text-gray-400 dark:text-gray-500">
              Last status ping:{" "}
              {state.connection.lastChecked
                ? new Date(state.connection.lastChecked).toLocaleTimeString()
                : "Not checked yet"}
            </div>
          </div>
        </Card>

        {/* Model Configurations */}
        <Card padding="md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Model Integrations & API Keys
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure Gemini 1.5 Pro and xAI Grok credentials
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Models for Evaluation
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleModelToggle("gemini")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    defaultModels.includes("gemini")
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-200 dark:ring-indigo-800"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">Google Gemini</span>
                    <Badge variant={defaultModels.includes("gemini") ? "info" : "default"}>
                      {defaultModels.includes("gemini") ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gemini 1.5 Pro</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleModelToggle("grok")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    defaultModels.includes("grok")
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 ring-2 ring-purple-200 dark:ring-purple-800"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">xAI Grok</span>
                    <Badge variant={defaultModels.includes("grok") ? "purple" : "default"}>
                      {defaultModels.includes("grok") ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Grok-2</p>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="relative">
                <Input
                  label="Google AI Studio Key (Gemini)"
                  type={showGeminiKey ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  icon={<Key className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-8 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showGeminiKey ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="xAI Grok API Key"
                  type={showGrokKey ? "text" : "password"}
                  value={grokKey}
                  onChange={(e) => setGrokKey(e.target.value)}
                  placeholder="xai-..."
                  icon={<Key className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowGrokKey(!showGrokKey)}
                  className="absolute right-3 top-8 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showGrokKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hallucination Detection Sensitivity
                </label>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {sensitivity === "0.90"
                    ? "Strict (0.90)"
                    : sensitivity === "0.75"
                    ? "Balanced (0.75)"
                    : "Lenient (0.60)"}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>Fewer False Flags</span>
                <span>Balanced</span>
                <span>Catch All Variations</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance & Theme */}
        <Card padding="md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Appearance & Theme
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customize your interface visual presentation
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Laptop },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id as ThemeMode)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    state.settings.theme === id
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-200 dark:ring-indigo-800 shadow-sm"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Theme changes take effect across all application routes and dashboard components immediately. You can also quickly toggle between light and dark modes using the icon in the header.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
