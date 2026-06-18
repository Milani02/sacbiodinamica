import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "text-muted-foreground",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  /** Token-based text color for the icon, e.g. "text-status-progress". */
  accent?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums tracking-tight">
          {value}
        </CardTitle>
        {hint ? (
          <CardDescription className="text-xs">{hint}</CardDescription>
        ) : null}
        <CardAction>
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg bg-muted",
              accent,
            )}
          >
            <Icon className="size-4.5" />
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
