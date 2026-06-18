import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TICKET_STATUS } from "@/features/tickets/constants";
import type { TicketStatus } from "@/types/domain";

// Full, static class strings so Tailwind can detect them at build time.
const styles: Record<TicketStatus, { badge: string; dot: string }> = {
  new: { badge: "border-status-new/25 bg-status-new/10 text-status-new", dot: "bg-status-new" },
  open: { badge: "border-status-open/25 bg-status-open/10 text-status-open", dot: "bg-status-open" },
  in_progress: { badge: "border-status-progress/25 bg-status-progress/10 text-status-progress", dot: "bg-status-progress" },
  waiting_client: { badge: "border-status-waiting/25 bg-status-waiting/10 text-status-waiting", dot: "bg-status-waiting" },
  resolved: { badge: "border-status-resolved/25 bg-status-resolved/10 text-status-resolved", dot: "bg-status-resolved" },
  closed: { badge: "border-status-closed/25 bg-status-closed/10 text-status-closed", dot: "bg-status-closed" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  const style = styles[status];
  return (
    <Badge variant="outline" className={cn(style.badge, className)}>
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      {TICKET_STATUS[status].label}
    </Badge>
  );
}
