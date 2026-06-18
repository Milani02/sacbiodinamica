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
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { AgentDashboard } from "@/components/dashboard/agent-dashboard";
import { StatusChart } from "@/components/dashboard/status-chart";
import { SectorChart } from "@/components/dashboard/sector-chart";
import { TicketsTable } from "@/components/tickets/tickets-table";
import { listTickets } from "@/features/tickets/queries";
import { getCurrentUser } from "@/features/auth/current-user";
import { can } from "@/features/auth/roles";
import {
  ACTIVE_STATUSES,
  TICKET_STATUS,
  TICKET_STATUS_ORDER,
} from "@/features/tickets/constants";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [tickets, user] = await Promise.all([listTickets(), getCurrentUser()]);
  const isStaff = user ? can.respondTickets(user.role) : false;

  // Cada perfil tem uma visão própria.
  if (user && user.role === "client") {
    return <ClientDashboard user={user} tickets={tickets} />;
  }
  if (user && user.role === "agent") {
    return <AgentDashboard user={user} tickets={tickets} />;
  }
  // Admin: visão global da central (abaixo).

  const openCount = tickets.filter((t) =>
    ACTIVE_STATUSES.includes(t.status),
  ).length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const waitingCount = tickets.filter((t) => t.status === "waiting_client").length;
  const urgentCount = tickets.filter(
    (t) =>
      ["high", "urgent"].includes(t.priority) &&
      !["resolved", "closed"].includes(t.status),
  ).length;

  const statusData = TICKET_STATUS_ORDER.map((s) => ({
    key: s,
    label: TICKET_STATUS[s].label,
    count: tickets.filter((t) => t.status === s).length,
    color: `var(--${TICKET_STATUS[s].token})`,
  }));

  const bySector = new Map<string, number>();
  for (const t of tickets) {
    bySector.set(t.sector.name, (bySector.get(t.sector.name) ?? 0) + 1);
  }
  const sectorData = [...bySector.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const myTickets = (
    isStaff && user
      ? tickets.filter((t) => t.assigneeId === user.id)
      : tickets
  ).filter((t) => ACTIVE_STATUSES.includes(t.status));

  const recent = tickets.slice(0, 6);

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chamados por status</CardTitle>
            <CardDescription>Distribuição atual da central.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusChart data={statusData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chamados por setor</CardTitle>
            <CardDescription>Volume por área responsável.</CardDescription>
          </CardHeader>
          <CardContent>
            <SectorChart data={sectorData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus chamados em aberto</CardTitle>
          <CardDescription>
            {isStaff
              ? "Chamados atribuídos a você que ainda estão ativos."
              : "Seus chamados ativos na central."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketsTable
            tickets={myTickets}
            emptyHint={
              isStaff
                ? "Nenhum chamado atribuído a você no momento."
                : "Você não tem chamados em aberto."
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chamados recentes</CardTitle>
          <CardDescription>Últimas movimentações na central.</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketsTable tickets={recent} />
        </CardContent>
      </Card>
    </>
  );
}
