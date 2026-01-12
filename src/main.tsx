import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import "./i18n/config";

// Check if root element exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found!");
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>خطأ: عنصر الجذر غير موجود</h1></div>';
} else {
  try {
    // Wrap App in ErrorBoundary with StrictMode for better error detection
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
  } catch (error) {
    console.error("Error rendering app:", error);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #ef4444;">حدث خطأ في تحميل التطبيق</h1>
        <p style="color: #6b7280; margin: 20px 0;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          تحديث الصفحة
        </button>
      </div>
    `;
  }
}
