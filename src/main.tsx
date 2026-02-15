import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import App from "./App";
import { I18nProvider } from "./i18n/I18nContext";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const client = convexUrl ? new ConvexReactClient(convexUrl) : null;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider>
      <BrowserRouter>
        {client ? (
          <ConvexProvider client={client}>
            <App />
          </ConvexProvider>
        ) : (
          <App />
        )}
      </BrowserRouter>
    </I18nProvider>
  </React.StrictMode>
);
