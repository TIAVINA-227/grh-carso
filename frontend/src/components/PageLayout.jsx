import React from "react";

export default function PageLayout({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${className}`}>
      {children}
    </div>
  );
}
