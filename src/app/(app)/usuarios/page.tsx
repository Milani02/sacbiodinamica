import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { UsersManager } from "@/components/users/users-manager";
import { listUsers } from "@/features/users/queries";
import { listSectors } from "@/features/sectors/queries";
import { getCurrentUser } from "@/features/auth/current-user";
import { can } from "@/features/auth/roles";

export const metadata: Metadata = { title: "Usuários" };

export default async function UsuariosPage() {
  const [users, sectors, me] = await Promise.all([
    listUsers(),
    listSectors(),
    getCurrentUser(),
  ]);

  const canManage = me ? can.manageUsers(me.role) : false;

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Equipe com acesso à plataforma."
      />
      <UsersManager users={users} sectors={sectors} canManage={canManage} />
    </>
  );
}
