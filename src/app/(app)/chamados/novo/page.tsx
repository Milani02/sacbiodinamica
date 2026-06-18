import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { NovoChamadoForm } from "@/components/tickets/novo-chamado-form";
import { listClients } from "@/features/clients/queries";
import { listSectors } from "@/features/sectors/queries";
import { getCurrentUser } from "@/features/auth/current-user";

export const metadata: Metadata = { title: "Novo chamado" };

export default async function NovoChamadoPage() {
  const user = await getCurrentUser();
  const isClient = user?.role === "client";
  const [clients, sectors] = await Promise.all([
    isClient ? Promise.resolve([]) : listClients(),
    listSectors(),
  ]);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/chamados">
            <ArrowLeft data-icon="inline-start" />
            Chamados
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Novo chamado"
        description={
          isClient
            ? "Conte o que você precisa e nossa equipe responde por aqui."
            : "Abra um atendimento na central."
        }
      />

      <NovoChamadoForm
        clients={clients}
        sectors={sectors}
        isClient={isClient}
      />
    </>
  );
}
