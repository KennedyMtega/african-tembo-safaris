import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const breadcrumbMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/packages": "Packages",
  "/admin/bookings": "Bookings",
  "/admin/users": "Users",
  "/admin/payments": "Payments",
  "/admin/destinations": "Destinations",
  "/admin/reviews": "Reviews",
  "/admin/inquiries": "Inquiries",
  "/admin/activity": "Activity Log",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

export function AdminLayout() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  if (!isAdmin) return <Navigate to="/admin" replace />;

  const pageTitle = breadcrumbMap[location.pathname] ?? "Admin";

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{pageTitle}</h2>
            <span className="text-xs text-muted-foreground">/ Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search…" className="h-8 w-48 pl-8 text-xs" />
            </div>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full bg-destructive px-1 text-[9px] text-destructive-foreground">3</Badge>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
