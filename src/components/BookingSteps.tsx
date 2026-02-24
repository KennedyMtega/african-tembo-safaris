import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStepsProps {
  currentStep: number;
  steps: string[];
}

export function BookingSteps({ currentStep, steps }: BookingStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
              done && "bg-safari-green text-primary-foreground",
              active && "bg-primary text-primary-foreground",
              !done && !active && "border border-border bg-muted text-muted-foreground"
            )}>
              {done ? <Check className="h-4 w-4" /> : step}
            </div>
            <span className={cn("hidden text-sm font-medium sm:inline", active ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            {i < steps.length - 1 && <div className="mx-1 h-px w-8 bg-border sm:w-12" />}
          </div>
        );
      })}
    </div>
  );
}
