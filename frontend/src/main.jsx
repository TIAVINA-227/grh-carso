// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./components/ui/use-toast"; // ✅ importe le provider
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
 
      <ToastProvider> {/* entoure l'application avec le provider */}
      <App />
      </ToastProvider>
   
  </React.StrictMode>
);
