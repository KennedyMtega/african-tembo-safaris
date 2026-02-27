import { useState } from "react";
import {
  LayoutDashboard, Package, CalendarCheck, Users, CreditCard, LogOut,
  BarChart3, MapPin, Star, MessageSquare, Activity, Settings, FileText,
  ChevronLeft, ChevronRight, GalleryHorizontalEnd, BookOpen, Contact,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import temboLogo from "@/assets/tembo-logo.jpg";

const sections = [
  {
    label: "Main",
    links: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    links: [
      { to: "/admin/packages", label: "Packages", icon: Package },
      { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    label: "Operations",
    links: [
      { to: "/admin/destinations", label: "Destinations", icon: MapPin },
      { to: "/admin/gallery", label: "Gallery", icon: GalleryHorizontalEnd },
      { to: "/admin/reviews", label: "Reviews", icon: Star },
      { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
      { to: "/admin/knowledge-base", label: "Knowledge Base", icon: BookOpen },
      { to: "/admin/crm", label: "CRM", icon: Contact },
    ],
  },
  {
    label: "System",
    links: [
      { to: "/admin/activity", label: "Activity Log", icon: Activity },
      { to: "/admin/reports", label: "Reports", icon: FileText },
      { to: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
    ],
  },
];

export function AdminSidebar() {
  const { profile, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => { await signOut(); navigate("/admin"); };

  return (
    <aside className={cn(
      "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="flex items-center justify-between border-b border-sidebar-border p-3">
        <div className={cn("flex items-center gap-2 overflow-hidden", collapsed && "justify-center")}>
          <img src={temboLogo} alt="Tembo" className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
          {!collapsed && <span className="font-display text-sm font-bold text-sidebar-foreground truncate">Tembo Admin</span>}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-sidebar-foreground/50" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.links
                .filter((l) => !(l as any).adminOnly || userRole === "admin")
                .map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
                    collapsed && "justify-center px-2"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                >
                  <l.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{l.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2 space-y-1">
        {!collapsed && profile && (
          <div className="flex items-center gap-2 rounded-md px-3 py-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {profile.fullName?.charAt(0) || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-sidebar-foreground">{profile.fullName || "Admin"}</p>
              <Badge variant={userRole === "admin" ? "default" : "secondary"} className="text-[9px] h-4 px-1.5">
                {userRole}
              </Badge>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full gap-2 text-sidebar-foreground/60 hover:text-destructive",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </aside>
  );
}
