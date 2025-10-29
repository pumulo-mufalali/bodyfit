import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./providers/theme-provider";
import { APIProvider } from "./providers/api-provider";
import { AuthProvider } from "./providers/auth-provider";
import { SettingsProvider } from "./providers/settings-provider";
import { ErrorBoundary } from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <APIProvider>
          <AuthProvider>
            <SettingsProvider>
              <App />
            </SettingsProvider>
          </AuthProvider>
        </APIProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

