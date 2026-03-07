import { useParams, Link, useSearchParams } from "react-router-dom";
import { CheckCircle, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingConfirmation() {
  const { ref } = useParams<{ ref: string }>();
  const [searchParams] = useSearchParams();
  const deposit = searchParams.get("deposit");
  const total = searchParams.get("total");

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container max-w-lg text-center">
        <Card className="border-border/50">
          <CardContent className="p-8 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-safari-green/10">
              <CheckCircle className="h-8 w-8 text-safari-green" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your safari adventure has been reserved. Our team will contact you within 48 hours with secure payment details for your deposit.</p>
            <div className="rounded-md bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">Your Booking Reference</p>
              <p className="font-display text-2xl font-bold text-primary">{ref}</p>
            </div>

            {deposit && total && (
              <div className="rounded-md border border-border p-4 space-y-3 text-left">
                <h3 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Payment Summary
                </h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Trip Cost</span>
                    <span className="text-foreground">${Number(total).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-primary">Deposit Due (50%)</span>
                    <span className="text-primary">${Number(deposit).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining Balance</span>
                    <span className="text-foreground">${(Number(total) - Number(deposit)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-md bg-accent/50 p-4 text-left">
              <h3 className="font-display text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" /> What Happens Next
              </h3>
              <ol className="space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
                <li>Our safari team will email you within 48 hours with payment options</li>
                <li>Pay your 50% deposit to secure your dates</li>
                <li>Remaining balance is due 30 days before departure</li>
                <li>Receive your complete trip preparation guide via email</li>
              </ol>
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
