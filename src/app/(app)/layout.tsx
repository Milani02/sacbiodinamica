import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { currentUser } from "@/lib/mock/data";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fase 0: usuário mockado. Na Fase 1 virá da sessão do Supabase.
  const user = currentUser;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <AppTopbar user={user} />
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
