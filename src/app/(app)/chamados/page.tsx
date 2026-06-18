import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { TicketsList } from "@/components/tickets/tickets-list";
import { sectors, ticketsWithRelations } from "@/lib/mock/data";

export const metadata: Metadata = { title: "Chamados" };

export default function ChamadosPage() {
  return (
    <>
      <PageHeader
        title="Chamados"
        description="Todos os atendimentos da central."
        actions={
          <Button asChild>
            <Link href="/chamados/novo">
              <Plus data-icon="inline-start" />
              Novo chamado
            </Link>
          </Button>
        }
      />
      <TicketsList tickets={ticketsWithRelations} sectors={sectors} />
    </>
  );
}
