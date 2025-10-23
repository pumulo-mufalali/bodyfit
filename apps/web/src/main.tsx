import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./providers/theme-provider";
import { APIProvider } from "./providers/api-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <APIProvider>
        <App />
      </APIProvider>
    </ThemeProvider>
  </React.StrictMode>
);

