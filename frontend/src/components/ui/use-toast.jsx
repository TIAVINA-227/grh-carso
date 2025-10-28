import { createContext, useContext, useState, useCallback } from "react";

// ✅ Contexte global pour les toasts
const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);

    // Retirer automatiquement le toast après 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Affichage des toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-md text-sm font-medium text-white ${
              t.variant === "destructive" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {t.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ✅ Hook pour utiliser le toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
