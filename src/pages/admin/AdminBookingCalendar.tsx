import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import type { Booking } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-safari-gold text-foreground",
  confirmed: "bg-safari-green text-primary-foreground",
  completed: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

const statusDotColors: Record<string, string> = {
  pending: "bg-safari-gold",
  confirmed: "bg-safari-green",
  completed: "bg-primary",
  cancelled: "bg-destructive",
};

export default function AdminBookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => bookingService.getAll(),
  });

  // Group bookings by start date
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      const key = b.startDate;
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return map;
  }, [bookings]);

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const selectedBookings = selectedDate
    ? bookingsByDate[format(selectedDate, "yyyy-MM-dd")] || []
    : [];

  const handleDayClick = (d: Date) => {
    setSelectedDate(d);
    const key = format(d, "yyyy-MM-dd");
    if (bookingsByDate[key]?.length) {
      setSheetOpen(true);
    }
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">Booking Calendar</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/bookings">
            <Button variant="outline" size="sm">List View</Button>
          </Link>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          {/* Month Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-display text-base font-semibold text-foreground">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Loading bookings…</p>
          ) : (
            <div className="overflow-x-auto">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-px">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-px rounded-md border border-border/50 bg-border/30">
                {weeks.flat().map((d, i) => {
                  const key = format(d, "yyyy-MM-dd");
                  const dayBookings = bookingsByDate[key] || [];
                  const isCurrentMonth = isSameMonth(d, currentMonth);
                  const isToday = isSameDay(d, new Date());
                  const isSelected = selectedDate && isSameDay(d, selectedDate);

                  return (
                    <button
                      key={i}
                      onClick={() => handleDayClick(d)}
                      className={`
                        relative flex min-h-[80px] flex-col items-start p-1.5 text-left transition-colors
                        ${isCurrentMonth ? "bg-card" : "bg-muted/30"}
                        ${isSelected ? "ring-2 ring-primary ring-inset" : ""}
                        ${isToday ? "bg-accent/20" : ""}
                        hover:bg-accent/10
                      `}
                    >
                      <span className={`text-xs font-medium ${isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"} ${isToday ? "rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground" : ""}`}>
                        {format(d, "d")}
                      </span>

                      {dayBookings.length > 0 && (
                        <div className="mt-1 flex w-full flex-col gap-0.5">
                          {dayBookings.slice(0, 3).map((b) => (
                            <div
                              key={b.id}
                              className={`flex items-center gap-1 rounded px-1 py-0.5 text-[10px] leading-tight ${statusColors[b.status]}`}
                              title={`${b.bookingRef} — ${b.packageTitle}`}
                            >
                              <span className="truncate">{b.bookingRef}</span>
                            </div>
                          ))}
                          {dayBookings.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{dayBookings.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {Object.entries(statusDotColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <span className="text-xs capitalize text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Bookings"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {selectedBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings on this date.</p>
            ) : (
              selectedBookings.map((b) => (
                <Card key={b.id} className="border-border/50">
                  <CardContent className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-foreground">{b.bookingRef}</span>
                      <Badge className={statusColors[b.status]}>{b.status}</Badge>
                    </div>
                    <p className="text-sm text-foreground">{b.packageTitle}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{b.travelers.length} traveler{b.travelers.length !== 1 ? "s" : ""}</span>
                      <span className="font-semibold text-foreground">${b.totalAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {b.startDate} → {b.endDate}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
