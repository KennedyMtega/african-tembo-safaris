import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LayoutDashboard, Calendar, Heart, UserCircle } from "lucide-react";

const sideLinks = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", to: "/dashboard/bookings", icon: Calendar },
  { label: "Wishlist", to: "/dashboard/wishlist", icon: Heart },
  { label: "Profile", to: "/dashboard/profile", icon: UserCircle },
];

export function CustomerLayout() {
  const { user, isLoading, isStaff } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading…</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (isStaff) return <Navigate to="/admin/dashboard" replace />;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:block">
          <nav className="sticky top-20 space-y-1 p-4">
            {sideLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.to;
              return (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" /> {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 bg-background p-6 md:p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
