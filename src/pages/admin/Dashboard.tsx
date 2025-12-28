import { useQuery } from "@tanstack/react-query";
import { Package, BookOpen, FileText, Settings, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { productsAPI, blogAPI } from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Admin Dashboard Page
 * 
 * Main dashboard showing overview statistics and quick actions.
 */
const Dashboard = () => {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productsAPI.getAll,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: blogPosts } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: blogAPI.getAll,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const stats = [
    {
      title: "المنتجات",
      value: products?.length || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/admin/products",
    },
    {
      title: "مقالات المدونة",
      value: blogPosts?.length || 0,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/admin/blog",
    },
    {
      title: "الصفحات",
      value: 8,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/admin/about",
    },
    {
      title: "الإعدادات",
      value: "فعال",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      link: "/admin/settings",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-2">
          مرحباً بك في لوحة التحكم - إدارة محتوى الموقع
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>الوصول السريع إلى الصفحات الرئيسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/products">
                <Package className="w-4 h-4 mr-2" />
                إدارة المنتجات
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/blog">
                <BookOpen className="w-4 h-4 mr-2" />
                إدارة المدونة
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/services">
                <FileText className="w-4 h-4 mr-2" />
                إدارة الخدمات
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/settings">
                <Settings className="w-4 h-4 mr-2" />
                الإعدادات العامة
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>نظرة عامة</CardTitle>
            <CardDescription>إحصائيات سريعة عن الموقع</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">إجمالي المنتجات</span>
              <span className="font-bold">{products?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">مقالات منشورة</span>
              <span className="font-bold">
                {blogPosts?.filter((p: any) => p.published).length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">مقالات مسودة</span>
              <span className="font-bold">
                {blogPosts?.filter((p: any) => !p.published).length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

