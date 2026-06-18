import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { USER_ROLE } from "@/features/auth/roles";
import { listUsers } from "@/features/users/queries";
import { listSectors } from "@/features/sectors/queries";
import { initials } from "@/lib/format";

export const metadata: Metadata = { title: "Usuários" };

export default async function UsuariosPage() {
  const [users, sectors] = await Promise.all([listUsers(), listSectors()]);
  const sectorName = new Map(sectors.map((s) => [s.id, s.name]));
  return (
    <>
      <PageHeader
        title="Usuários"
        description="Equipe com acesso à plataforma."
        actions={
          <Button disabled>
            <Plus data-icon="inline-start" />
            Novo usuário
          </Button>
        }
      />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Usuário</TableHead>
              <TableHead className="hidden md:table-cell">Perfil</TableHead>
              <TableHead className="hidden lg:table-cell">Setor</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {initials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid leading-tight">
                      <span className="font-medium">{user.fullName}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">{USER_ROLE[user.role].label}</Badge>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                  {user.sectorId ? sectorName.get(user.sectorId) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={user.isActive ? "secondary" : "outline"}>
                    {user.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
