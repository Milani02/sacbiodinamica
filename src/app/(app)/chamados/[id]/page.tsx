import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { StatusBadge } from "@/components/tickets/status-badge";
import { PriorityBadge } from "@/components/tickets/priority-badge";
import { can } from "@/features/auth/roles";
import {
  currentUser,
  messages as allMessages,
  tickets,
  withRelations,
} from "@/lib/mock/data";
import { formatDateTime, formatRelative, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TicketMessage } from "@/types/domain";

export const metadata: Metadata = { title: "Chamado" };

function MessageBubble({ message }: { message: TicketMessage }) {
  const isStaff = message.authorId.startsWith("u");
  return (
    <div className="flex gap-3">
      <Avatar className="size-8">
        <AvatarFallback
          className={cn(
            "text-xs",
            message.isInternal
              ? "bg-warning/15 text-warning"
              : isStaff
                ? "bg-primary/10 text-primary"
                : "bg-muted",
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
            "mt-1 rounded-lg border px-3 py-2 text-sm",
            message.isInternal
              ? "border-warning/30 bg-warning/5"
              : "bg-card",
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
  const base = tickets.find((t) => t.id === id);
  if (!base) notFound();

  const ticket = withRelations(base);
  const threadMessages = allMessages.filter(
    (m) => m.ticketId === ticket.id && !m.isInternal,
  );
  const internalNotes = allMessages.filter(
    (m) => m.ticketId === ticket.id && m.isInternal,
  );
  const showInternal = can.seeInternalNotes(currentUser.role);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/chamados">
            <ArrowLeft data-icon="inline-start" />
            Chamados
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
              <p className="text-sm leading-relaxed text-muted-foreground">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="conversa">
            <TabsList>
              <TabsTrigger value="conversa">Conversa</TabsTrigger>
              {showInternal ? (
                <TabsTrigger value="notas">
                  <Lock data-icon="inline-start" />
                  Notas internas
                </TabsTrigger>
              ) : null}
            </TabsList>

            <TabsContent value="conversa" className="flex flex-col gap-4">
              {threadMessages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              <Separator />
              <InputGroup>
                <InputGroupTextarea
                  placeholder="Escreva uma resposta ao solicitante..."
                  disabled
                />
                <InputGroupAddon align="block-end">
                  <InputGroupButton className="ml-auto" disabled>
                    <Send data-icon="inline-start" />
                    Responder
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <p className="text-xs text-muted-foreground">
                O envio de mensagens será ativado na Fase 2.
              </p>
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
              </TabsContent>
            ) : null}
          </Tabs>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
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
            <Separator />
            <Detail label="Setor responsável">{ticket.sector.name}</Detail>
            <Detail label="Responsável">
              {ticket.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-muted text-[10px]">
                      {initials(ticket.assignee.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{ticket.assignee.fullName}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Não atribuído</span>
              )}
            </Detail>
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
    <div className="grid gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div>{children}</div>
    </div>
  );
}
