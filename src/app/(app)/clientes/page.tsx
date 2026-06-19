import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ClientsManager } from "@/components/clients/clients-manager";
import { listClients } from "@/features/clients/queries";
import { listTickets } from "@/features/tickets/queries";
import { getCurrentUser } from "@/features/auth/current-user";
import { can } from "@/features/auth/roles";

export const metadata: Metadata = { title: "Clientes" };

export default async function ClientesPage() {
  const [clients, tickets, user] = await Promise.all([
    listClients(),
    listTickets(),
    getCurrentUser(),
  ]);

  const counts: Record<string, number> = {};
  for (const t of tickets) {
    counts[t.requesterId] = (counts[t.requesterId] ?? 0) + 1;
  }

  const canManage = user ? can.manageClients(user.role) : false;
  const canDelete = user?.role === "admin";

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Solicitantes que abrem tickets na central."
      />
      <ClientsManager
        clients={clients}
        counts={counts}
        canManage={canManage}
        canDelete={canDelete}
      />
    </>
  );
}
