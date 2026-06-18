"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/current-user";
import type { TicketPriority, TicketStatus } from "@/types/domain";

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

const STATUSES: TicketStatus[] = [
  "new",
  "open",
  "in_progress",
  "waiting_client",
  "resolved",
  "closed",
];
const PRIORITIES: TicketPriority[] = ["low", "medium", "high", "urgent"];

function revalidateTicket(id?: string) {
  revalidatePath("/chamados");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/chamados/${id}`);
}

export async function createTicket(input: {
  title: string;
  description: string;
  requesterId: string;
  sectorId: string;
  priority: TicketPriority;
}): Promise<ActionResult> {
  const title = input.title.trim();
  const description = input.description.trim();
  if (!title) return { ok: false, error: "Informe um título." };
  if (!description) return { ok: false, error: "Descreva o chamado." };
  if (!input.sectorId) return { ok: false, error: "Selecione o setor." };
  if (!PRIORITIES.includes(input.priority)) {
    return { ok: false, error: "Prioridade inválida." };
  }

  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const supabase = await createClient();

  // Cliente abre chamado em seu próprio nome (resolve/cria o registro de
  // solicitante). Staff escolhe o solicitante na lista.
  let requesterId = input.requesterId;
  if (me.role === "client") {
    const { data: cid, error: rpcError } = await supabase.rpc("ensure_my_client");
    if (rpcError || !cid) {
      return { ok: false, error: "Não foi possível identificar seu cadastro." };
    }
    requesterId = cid;
  } else if (!requesterId) {
    return { ok: false, error: "Selecione o solicitante." };
  }

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      title,
      description,
      requester_id: requesterId,
      sector_id: input.sectorId,
      priority: input.priority,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: "Não foi possível abrir o chamado." };

  revalidateTicket(data.id);
  return { ok: true, id: data.id };
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus,
): Promise<ActionResult> {
  if (!STATUSES.includes(status)) {
    return { ok: false, error: "Status inválido." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, error: "Não foi possível atualizar o status." };
  revalidateTicket(id);
  return { ok: true };
}

export async function updateTicketPriority(
  id: string,
  priority: TicketPriority,
): Promise<ActionResult> {
  if (!PRIORITIES.includes(priority)) {
    return { ok: false, error: "Prioridade inválida." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update({ priority })
    .eq("id", id);
  if (error) {
    return { ok: false, error: "Não foi possível atualizar a prioridade." };
  }
  revalidateTicket(id);
  return { ok: true };
}

export async function assignTicket(
  id: string,
  assigneeId: string | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update({ assignee_id: assigneeId })
    .eq("id", id);
  if (error) {
    return { ok: false, error: "Não foi possível alterar o responsável." };
  }
  revalidateTicket(id);
  return { ok: true };
}

export async function addMessage(
  ticketId: string,
  body: string,
  isInternal: boolean,
): Promise<ActionResult> {
  const text = body.trim();
  if (!text) return { ok: false, error: "Escreva uma mensagem." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    author_id: user.id,
    body: text,
    is_internal: isInternal,
  });
  if (error) return { ok: false, error: "Não foi possível enviar a mensagem." };

  revalidateTicket(ticketId);
  return { ok: true };
}
