import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import App from "./App";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const client = convexUrl ? new ConvexReactClient(convexUrl) : null;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {client ? (
        <ConvexProvider client={client}>
          <App />
        </ConvexProvider>
      ) : (
        <App />
      )}
    </BrowserRouter>
  </React.StrictMode>
);
