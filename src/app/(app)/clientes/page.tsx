import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { clients, ticketsWithRelations } from "@/lib/mock/data";
import { initials } from "@/lib/format";

export const metadata: Metadata = { title: "Clientes" };

export default function ClientesPage() {
  return (
    <>
      <PageHeader
        title="Clientes"
        description="Solicitantes que abrem chamados na central."
        actions={
          <Button disabled>
            <Plus data-icon="inline-start" />
            Novo cliente
          </Button>
        }
      />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Empresa</TableHead>
              <TableHead className="hidden lg:table-cell">Telefone</TableHead>
              <TableHead className="text-right">Chamados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => {
              const count = ticketsWithRelations.filter(
                (t) => t.requesterId === client.id,
              ).length;
              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {initials(client.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid leading-tight">
                        <span className="font-medium">{client.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {client.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {client.company ?? "—"}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                    {client.phone ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {count}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
