"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TICKET_PRIORITY,
  TICKET_PRIORITY_ORDER,
  TICKET_STATUS,
  TICKET_STATUS_ORDER,
} from "@/features/tickets/constants";
import {
  assignTicket,
  updateTicketPriority,
  updateTicketStatus,
  type ActionResult,
} from "@/features/tickets/actions";
import type { TicketPriority, TicketStatus, User } from "@/types/domain";

const UNASSIGNED = "unassigned";

function useAction() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      const res = await fn();
      if (res.ok) {
        toast.success("Chamado atualizado");
        router.refresh();
      } else {
        toast.error(res.error ?? "Não foi possível atualizar.");
      }
    });
  return { pending, run };
}

export function StatusSelect({
  ticketId,
  value,
}: {
  ticketId: string;
  value: TicketStatus;
}) {
  const { pending, run } = useAction();
  return (
    <Select
      value={value}
      disabled={pending}
      onValueChange={(v) => run(() => updateTicketStatus(ticketId, v as TicketStatus))}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {TICKET_STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {TICKET_STATUS[s].label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function PrioritySelect({
  ticketId,
  value,
}: {
  ticketId: string;
  value: TicketPriority;
}) {
  const { pending, run } = useAction();
  return (
    <Select
      value={value}
      disabled={pending}
      onValueChange={(v) =>
        run(() => updateTicketPriority(ticketId, v as TicketPriority))
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {TICKET_PRIORITY_ORDER.map((p) => (
            <SelectItem key={p} value={p}>
              {TICKET_PRIORITY[p].label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function AssigneeSelect({
  ticketId,
  value,
  agents,
}: {
  ticketId: string;
  value: string | null;
  agents: User[];
}) {
  const { pending, run } = useAction();
  return (
    <Select
      value={value ?? UNASSIGNED}
      disabled={pending}
      onValueChange={(v) =>
        run(() => assignTicket(ticketId, v === UNASSIGNED ? null : v))
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={UNASSIGNED}>Não atribuído</SelectItem>
          {agents.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.fullName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
