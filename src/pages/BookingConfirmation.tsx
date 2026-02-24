import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingConfirmation() {
  const { ref } = useParams<{ ref: string }>();

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container max-w-lg text-center">
        <Card className="border-border/50">
          <CardContent className="p-8 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-safari-green/10">
              <CheckCircle className="h-8 w-8 text-safari-green" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your safari adventure has been reserved. We'll be in touch shortly with further details.</p>
            <div className="rounded-md bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">Your Booking Reference</p>
              <p className="font-display text-2xl font-bold text-primary">{ref}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild><Link to="/packages">Browse More Packages</Link></Button>
              <Button asChild variant="outline"><Link to="/">Return Home</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
