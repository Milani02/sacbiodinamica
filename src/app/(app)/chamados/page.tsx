import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { TicketsList } from "@/components/tickets/tickets-list";
import { listTickets } from "@/features/tickets/queries";
import { listSectors } from "@/features/sectors/queries";

export const metadata: Metadata = { title: "Tickets" };

export default async function ChamadosPage() {
  const [tickets, sectors] = await Promise.all([listTickets(), listSectors()]);
  return (
    <>
      <PageHeader
        title="Tickets"
        description="Todos os atendimentos da central."
        actions={
          <Button asChild>
            <Link href="/chamados/novo">
              <Plus data-icon="inline-start" />
              Novo ticket
            </Link>
          </Button>
        }
      />
      <TicketsList tickets={tickets} sectors={sectors} />
    </>
  );
}
