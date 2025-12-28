import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Eye,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin Dashboard Layout
 * 
 * Provides the main layout structure for admin pages including sidebar navigation.
 */
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/admin/login");
  };

  const menuItems = [
    {
      title: "لوحة التحكم",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      title: "المنتجات",
      icon: Package,
      path: "/admin/products",
    },
    {
      title: "المستخدمون",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "الخدمات",
      icon: Wrench,
      path: "/admin/services",
    },
    {
      title: "المدونة",
      icon: BookOpen,
      path: "/admin/blog",
    },
    {
      title: "الإعدادات",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">لوحة التحكم</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-primary">مصانع الدلتا</h2>
              <p className="text-sm text-muted-foreground">لوحة التحكم</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t space-y-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>عرض الموقع</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

