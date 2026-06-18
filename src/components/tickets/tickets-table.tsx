import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Inbox } from "lucide-react";
import { StatusBadge } from "@/components/tickets/status-badge";
import { PriorityBadge } from "@/components/tickets/priority-badge";
import { formatRelative, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TicketPriority, TicketWithRelations } from "@/types/domain";

// Signature: a priority-colored rail on each row.
const rail: Record<TicketPriority, string> = {
  low: "bg-prio-low/50",
  medium: "bg-prio-medium",
  high: "bg-prio-high",
  urgent: "bg-prio-urgent",
};

export function TicketsTable({
  tickets,
  emptyHint,
}: {
  tickets: TicketWithRelations[];
  emptyHint?: string;
}) {
  if (tickets.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>Nenhum chamado por aqui</EmptyTitle>
          <EmptyDescription>
            {emptyHint ?? "Quando houver chamados, eles aparecerão nesta lista."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-1 p-0" />
            <TableHead className="w-[120px]">Código</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead className="hidden md:table-cell">Setor</TableHead>
            <TableHead className="hidden lg:table-cell">Responsável</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Prioridade</TableHead>
            <TableHead className="hidden xl:table-cell">Atualizado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="group">
              <TableCell className="p-0">
                <div
                  className={cn("ml-0.5 h-9 w-1 rounded-full", rail[ticket.priority])}
                  aria-hidden
                />
              </TableCell>
              <TableCell>
                <Link
                  href={`/chamados/${ticket.id}`}
                  className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary"
                >
                  {ticket.code}
                </Link>
              </TableCell>
              <TableCell className="max-w-[280px]">
                <Link href={`/chamados/${ticket.id}`} className="block">
                  <span className="block truncate font-medium">
                    {ticket.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {ticket.requester.name}
                    {ticket.requester.company
                      ? ` · ${ticket.requester.company}`
                      : ""}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                {ticket.sector.name}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {ticket.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-muted text-[10px]">
                        {initials(ticket.assignee.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{ticket.assignee.fullName}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Não atribuído
                  </span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <PriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                {formatRelative(ticket.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
