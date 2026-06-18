import type { Metadata } from "next";
import { AlertTriangle, Clock, Inbox, MessageSquareDot } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { TicketsTable } from "@/components/tickets/tickets-table";
import { ticketsWithRelations } from "@/lib/mock/data";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const tickets = ticketsWithRelations;

  const openCount = tickets.filter((t) =>
    ["new", "open", "in_progress", "waiting_client"].includes(t.status),
  ).length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const waitingCount = tickets.filter((t) => t.status === "waiting_client").length;
  const urgentCount = tickets.filter(
    (t) =>
      ["high", "urgent"].includes(t.priority) &&
      !["resolved", "closed"].includes(t.status),
  ).length;

  const recent = [...tickets]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title="Visão geral"
        description="Acompanhe os chamados da central de atendimento."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Chamados em aberto"
          value={openCount}
          hint="Aguardando tratamento ou em curso"
          icon={Inbox}
          accent="text-status-open"
        />
        <StatCard
          label="Em atendimento"
          value={inProgressCount}
          hint="Sendo trabalhados agora"
          icon={MessageSquareDot}
          accent="text-status-progress"
        />
        <StatCard
          label="Aguardando cliente"
          value={waitingCount}
          hint="Pendentes de resposta do solicitante"
          icon={Clock}
          accent="text-status-waiting"
        />
        <StatCard
          label="Prioridade alta/urgente"
          value={urgentCount}
          hint="Exigem atenção imediata"
          icon={AlertTriangle}
          accent="text-prio-urgent"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chamados recentes</CardTitle>
          <CardDescription>
            Últimas movimentações na central.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketsTable tickets={recent} />
        </CardContent>
      </Card>
    </>
  );
}
