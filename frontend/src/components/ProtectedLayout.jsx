import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ProtectedLayout() {
  const [status, setStatus] = useState("checking"); // checking | ok | unauth

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauth");
      return;
    }

    // Verify token with server
    fetch(`${API_BASE}/api/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setStatus("ok");
        } else {
          throw new Error("Unauthorized");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setStatus("unauth");
      });
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
          <div className="mt-3 text-sm text-muted-foreground">Vérification...</div>
        </div>
      </div>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/" replace />;
  }

  // status === 'ok'
  return <Outlet />;
}