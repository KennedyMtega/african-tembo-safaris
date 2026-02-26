import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const statusColors: Record<string, string> = {
  pending: "bg-secondary text-muted-foreground",
  confirmed: "bg-primary/10 text-primary",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function CustomerBookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingService.getMyBookings(),
  });

  const handleCancel = async (id: string) => {
    try {
      await bookingService.updateStatus(id, "cancelled");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast({ title: "Booking cancelled" });
    } catch {
      toast({ title: "Failed to cancel", variant: "destructive" });
    }
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-display text-xl font-bold text-foreground">My Bookings</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : bookings.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">You haven't made any bookings yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="border-border/50">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display font-semibold text-foreground">{b.packageTitle || "Safari Package"}</p>
                    <Badge className={statusColors[b.status] ?? ""}>{b.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ref: {b.bookingRef} · {format(new Date(b.startDate), "MMM d")} – {format(new Date(b.endDate), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${b.totalAmount.toLocaleString()} · Payment: <span className="capitalize">{b.paymentStatus}</span>
                  </p>
                </div>
                {b.status === "pending" && (
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleCancel(b.id)}>
                    Cancel Booking
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
