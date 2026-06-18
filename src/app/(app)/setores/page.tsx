import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { sectors, ticketsWithRelations } from "@/lib/mock/data";

export const metadata: Metadata = { title: "Setores" };

export default function SetoresPage() {
  return (
    <>
      <PageHeader
        title="Setores"
        description="Áreas responsáveis pelo atendimento dos chamados."
        actions={
          <Button disabled>
            <Plus data-icon="inline-start" />
            Novo setor
          </Button>
        }
      />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Setor</TableHead>
              <TableHead className="hidden sm:table-cell">Descrição</TableHead>
              <TableHead className="text-right">Chamados</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.map((sector) => {
              const count = ticketsWithRelations.filter(
                (t) => t.sectorId === sector.id,
              ).length;
              return (
                <TableRow key={sector.id}>
                  <TableCell className="font-medium">{sector.name}</TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    {sector.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {count}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={sector.isActive ? "secondary" : "outline"}>
                      {sector.isActive ? "Ativo" : "Inativo"}
                    </Badge>
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
