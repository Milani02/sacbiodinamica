import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/tickets/status-badge";
import { PriorityBadge } from "@/components/tickets/priority-badge";
import {
  AssigneeSelect,
  PrioritySelect,
  StatusSelect,
} from "@/components/tickets/ticket-controls";
import { MessageComposer } from "@/components/tickets/message-composer";
import { can } from "@/features/auth/roles";
import { getCurrentUser } from "@/features/auth/current-user";
import {
  getTicket,
  getTicketMessages,
} from "@/features/tickets/queries";
import { listAgents } from "@/features/users/queries";
import { formatDateTime, formatRelative, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TicketMessage } from "@/types/domain";

export const metadata: Metadata = { title: "Ticket" };

function MessageBubble({ message }: { message: TicketMessage }) {
  return (
    <div className="flex gap-3">
      <Avatar className="size-8">
        <AvatarFallback
          className={cn(
            "text-xs",
            message.isInternal
              ? "bg-warning/15 text-warning"
              : "bg-primary/10 text-primary",
          )}
        >
          {initials(message.authorName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{message.authorName}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelative(message.createdAt)}
          </span>
        </div>
        <div
          className={cn(
            "mt-1 rounded-lg border px-3 py-2 text-sm whitespace-pre-wrap",
            message.isInternal ? "border-warning/30 bg-warning/5" : "bg-card",
          )}
        >
          {message.body}
        </div>
      </div>
    </div>
  );
}

export default async function ChamadoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const ticket = await getTicket(id);
  if (!ticket) notFound();

  const messages = await getTicketMessages(id);
  const isStaff = can.respondTickets(user.role);
  const showInternal = can.seeInternalNotes(user.role);
  const agents = isStaff ? await listAgents() : [];

  const thread = messages.filter((m) => !m.isInternal);
  const internalNotes = messages.filter((m) => m.isInternal);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/chamados">
            <ArrowLeft data-icon="inline-start" />
            Tickets
          </Link>
        </Button>
        <span className="font-mono text-xs text-muted-foreground">
          {ticket.code}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{ticket.title}</h2>
        <div className="flex items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="conversa">
            <TabsList>
              <TabsTrigger value="conversa">
                Conversa
                {thread.length > 0 ? (
                  <span className="text-muted-foreground">({thread.length})</span>
                ) : null}
              </TabsTrigger>
              {showInternal ? (
                <TabsTrigger value="notas">
                  <Lock data-icon="inline-start" />
                  Notas internas
                  {internalNotes.length > 0 ? (
                    <span className="text-muted-foreground">
                      ({internalNotes.length})
                    </span>
                  ) : null}
                </TabsTrigger>
              ) : null}
            </TabsList>

            <TabsContent value="conversa" className="flex flex-col gap-4">
              {thread.length > 0 ? (
                thread.map((m) => <MessageBubble key={m.id} message={m} />)
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma mensagem ainda. Comece a conversa abaixo.
                </p>
              )}
              <Separator />
              <MessageComposer ticketId={ticket.id} />
            </TabsContent>

            {showInternal ? (
              <TabsContent value="notas" className="flex flex-col gap-4">
                {internalNotes.length > 0 ? (
                  internalNotes.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma nota interna ainda.
                  </p>
                )}
                <Separator />
                <MessageComposer ticketId={ticket.id} isInternal />
              </TabsContent>
            ) : null}
          </Tabs>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            {isStaff ? (
              <>
                <Detail label="Status">
                  <StatusSelect ticketId={ticket.id} value={ticket.status} />
                </Detail>
                <Detail label="Prioridade">
                  <PrioritySelect ticketId={ticket.id} value={ticket.priority} />
                </Detail>
                <Detail label="Responsável">
                  <AssigneeSelect
                    ticketId={ticket.id}
                    value={ticket.assigneeId}
                    agents={agents}
                  />
                </Detail>
                <Separator />
              </>
            ) : null}

            <Detail label="Solicitante">
              <div className="grid">
                <span className="font-medium">{ticket.requester.name}</span>
                {ticket.requester.company ? (
                  <span className="text-xs text-muted-foreground">
                    {ticket.requester.company}
                  </span>
                ) : null}
              </div>
            </Detail>
            <Detail label="Setor responsável">{ticket.sector.name}</Detail>
            {!isStaff ? (
              <Detail label="Responsável">
                {ticket.assignee ? (
                  ticket.assignee.fullName
                ) : (
                  <span className="text-muted-foreground">Não atribuído</span>
                )}
              </Detail>
            ) : null}
            <Separator />
            <Detail label="Aberto em">{formatDateTime(ticket.createdAt)}</Detail>
            <Detail label="Atualizado em">
              {formatDateTime(ticket.updatedAt)}
            </Detail>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div>{children}</div>
    </div>
  );
}
