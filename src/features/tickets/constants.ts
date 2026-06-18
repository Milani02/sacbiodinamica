import type { TicketPriority, TicketStatus } from "@/types/domain";

interface StatusMeta {
  label: string;
  /** Tailwind utility prefix bound to a CSS token (see globals.css). */
  token: string;
}

export const TICKET_STATUS: Record<TicketStatus, StatusMeta> = {
  new: { label: "Novo", token: "status-new" },
  open: { label: "Aberto", token: "status-open" },
  in_progress: { label: "Em atendimento", token: "status-progress" },
  waiting_client: { label: "Aguardando cliente", token: "status-waiting" },
  resolved: { label: "Resolvido", token: "status-resolved" },
  closed: { label: "Fechado", token: "status-closed" },
};

export const TICKET_STATUS_ORDER: TicketStatus[] = [
  "new",
  "open",
  "in_progress",
  "waiting_client",
  "resolved",
  "closed",
];

interface PriorityMeta {
  label: string;
  token: string;
  /** Relative weight for sorting (higher = more urgent). */
  weight: number;
}

export const TICKET_PRIORITY: Record<TicketPriority, PriorityMeta> = {
  low: { label: "Baixa", token: "prio-low", weight: 1 },
  medium: { label: "Média", token: "prio-medium", weight: 2 },
  high: { label: "Alta", token: "prio-high", weight: 3 },
  urgent: { label: "Urgente", token: "prio-urgent", weight: 4 },
};

export const TICKET_PRIORITY_ORDER: TicketPriority[] = [
  "urgent",
  "high",
  "medium",
  "low",
];

/** Statuses considered "open work" for dashboard counters. */
export const ACTIVE_STATUSES: TicketStatus[] = [
  "new",
  "open",
  "in_progress",
  "waiting_client",
];
