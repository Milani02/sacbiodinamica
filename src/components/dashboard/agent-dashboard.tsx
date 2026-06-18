import Link from "next/link";
import { AlertTriangle, Clock, Inbox, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusChart } from "@/components/dashboard/status-chart";
import { TicketsTable } from "@/components/tickets/tickets-table";
import {
  ACTIVE_STATUSES,
  TICKET_STATUS,
  TICKET_STATUS_ORDER,
} from "@/features/tickets/constants";
import type { TicketWithRelations, User } from "@/types/domain";

export function AgentDashboard({
  user,
  tickets,
}: {
  user: User;
  tickets: TicketWithRelations[];
}) {
  const firstName = user.fullName.split(" ")[0] || "atendente";

  const mine = tickets.filter((t) => t.assigneeId === user.id);
  const mineActive = mine.filter((t) => ACTIVE_STATUSES.includes(t.status));
  const waitingMine = mine.filter((t) => t.status === "waiting_client").length;
  const urgentMine = mineActive.filter((t) =>
    ["high", "urgent"].includes(t.priority),
  ).length;

  const myQueue = user.sectorId
    ? tickets.filter(
        (t) =>
          t.sectorId === user.sectorId &&
          t.assigneeId === null &&
          ACTIVE_STATUSES.includes(t.status),
      )
    : [];

  const statusData = TICKET_STATUS_ORDER.map((s) => ({
    key: s,
    label: TICKET_STATUS[s].label,
    count: mine.filter((t) => t.status === s).length,
    color: `var(--${TICKET_STATUS[s].token})`,
  }));

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName}`}
        description="Sua fila de atendimento e o que precisa de ação."
        actions={
          <Button asChild>
            <Link href="/chamados/novo">Novo chamado</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Atribuídos a mim"
          value={mineActive.length}
          hint="Chamados ativos sob sua responsabilidade"
          icon={Inbox}
          accent="text-status-progress"
        />
        <StatCard
          label="Aguardando cliente"
          value={waitingMine}
          hint="Esperando resposta do solicitante"
          icon={Clock}
          accent="text-status-waiting"
        />
        <StatCard
          label="Fila do meu setor"
          value={myQueue.length}
          hint="Sem responsável, prontos para assumir"
          icon={Layers}
          accent="text-status-new"
        />
        <StatCard
          label="Alta/urgente (meus)"
          value={urgentMine}
          hint="Exigem atenção imediata"
          icon={AlertTriangle}
          accent="text-prio-urgent"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Meus chamados em aberto</CardTitle>
            <CardDescription>
              Chamados ativos atribuídos a você.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TicketsTable
              tickets={mineActive}
              emptyHint="Nenhum chamado atribuído a você no momento."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meus chamados por status</CardTitle>
            <CardDescription>Distribuição da sua carteira.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusChart data={statusData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fila do meu setor</CardTitle>
          <CardDescription>
            {user.sectorId
              ? "Chamados do seu setor ainda sem responsável."
              : "Você não está vinculado a um setor. Peça a um administrador para definir o seu setor."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketsTable
            tickets={myQueue}
            emptyHint="Nenhum chamado aguardando na fila do seu setor."
          />
        </CardContent>
      </Card>
    </>
  );
}
