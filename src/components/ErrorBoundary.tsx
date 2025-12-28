import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error info:", errorInfo);
    console.error("Error stack:", error.stack);
    
    // Log to console in a more readable format
    if (error.message) {
      console.error("Error message:", error.message);
    }
    if (errorInfo.componentStack) {
      console.error("Component stack:", errorInfo.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "40px", 
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif"
        }}>
          <h1 style={{ color: "#ef4444", marginBottom: "20px" }}>
            حدث خطأ في تحميل التطبيق
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            يرجى تحديث الصفحة أو التحقق من وحدة التحكم للأخطاء
          </p>
          {this.state.error && (
            <details style={{ 
              marginTop: "20px", 
              padding: "20px", 
              background: "#f3f4f6", 
              borderRadius: "8px",
              maxWidth: "600px",
              textAlign: "right"
            }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                تفاصيل الخطأ
              </summary>
              <pre style={{ 
                marginTop: "10px", 
                overflow: "auto",
                textAlign: "left",
                fontSize: "12px"
              }}>
                {this.state.error.toString()}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

