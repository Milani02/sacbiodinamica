import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { SectorsManager } from "@/components/sectors/sectors-manager";
import { listSectors } from "@/features/sectors/queries";
import { listTickets } from "@/features/tickets/queries";
import { getCurrentUser } from "@/features/auth/current-user";
import { can } from "@/features/auth/roles";

export const metadata: Metadata = { title: "Setores" };

export default async function SetoresPage() {
  const [sectors, tickets, user] = await Promise.all([
    listSectors(),
    listTickets(),
    getCurrentUser(),
  ]);

  const counts: Record<string, number> = {};
  for (const t of tickets) {
    counts[t.sectorId] = (counts[t.sectorId] ?? 0) + 1;
  }

  const canManage = user ? can.manageSectors(user.role) : false;

  return (
    <>
      <PageHeader
        title="Setores"
        description="Áreas responsáveis pelo atendimento dos chamados."
      />
      <SectorsManager
        sectors={sectors}
        counts={counts}
        canManage={canManage}
      />
    </>
  );
}
