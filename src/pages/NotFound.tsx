import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * NotFound Page (404)
 * 
 * Displays when a user navigates to a non-existent route.
 * Logs the error for debugging purposes.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">الصفحة غير موجودة</p>
        <p className="mb-8 text-muted-foreground">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
        <Link to="/" className="text-primary underline hover:text-primary/90 text-lg font-medium">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
