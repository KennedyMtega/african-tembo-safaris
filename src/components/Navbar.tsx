import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { format } from "date-fns";
import temboLogo from "@/assets/tembo-logo.jpg";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Packages", to: "/packages" },
  { label: "Destinations", to: "/destinations" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

function NotificationBell({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notification-count", userId],
    queryFn: () => notificationService.getUnreadCount(userId),
    refetchInterval: 30000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => notificationService.getByUser(userId),
    refetchInterval: 30000,
  });

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    queryClient.invalidateQueries({ queryKey: ["notification-count", userId] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hidden md:inline-flex">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex flex-col items-start gap-1 p-3 ${!n.read ? "bg-primary/5" : ""}`}
              onClick={() => !n.read && handleMarkRead(n.id)}
            >
              <span className="text-sm font-medium text-foreground">{n.title}</span>
              {n.message && <span className="text-xs text-muted-foreground line-clamp-2">{n.message}</span>}
              <span className="text-[10px] text-muted-foreground">{format(new Date(n.createdAt), "MMM d, h:mm a")}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={temboLogo} alt="African Tembo Safari" className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12" />
          <span className="font-display text-lg font-bold text-foreground md:text-xl">Tembo Safari</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {user && <NotificationBell userId={user.id} />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden gap-2 md:inline-flex">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {profile?.fullName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm">{profile?.fullName || "Account"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/dashboard"><User className="mr-2 h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}><LogOut className="mr-2 h-4 w-4" /> Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button asChild variant="ghost" size="sm"><Link to="/login">Sign In</Link></Button>
              <Button asChild size="sm"><Link to="/signup">Sign Up</Link></Button>
            </div>
          )}
          <Button asChild className="hidden md:inline-flex">
            <Link to="/packages">Book Now</Link>
          </Button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 ${pathname === link.to ? "text-primary" : "text-muted-foreground"}`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10">Dashboard</Link>
                <Button variant="ghost" className="justify-start" onClick={() => { signOut(); setOpen(false); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10">Sign In</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10">Sign Up</Link>
              </>
            )}
            <Button asChild className="mt-2">
              <Link to="/packages" onClick={() => setOpen(false)}>Book Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
