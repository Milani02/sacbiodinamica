import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  mapClient,
  mapMessage,
  mapSector,
  mapTicket,
  mapUser,
} from "@/features/mappers";
import type { TicketMessage, TicketWithRelations } from "@/types/domain";

/**
 * Lists all tickets the current user can see (scoped by RLS), with their
 * requester, sector and assignee resolved. Ordered by most recently updated.
 */
export async function listTickets(): Promise<TicketWithRelations[]> {
  const supabase = await createClient();

  const [tickets, sectors, clients, profiles] = await Promise.all([
    supabase.from("tickets").select("*").order("updated_at", { ascending: false }),
    supabase.from("sectors").select("*"),
    supabase.from("clients").select("*"),
    supabase.from("profiles").select("*"),
  ]);

  if (tickets.error) throw tickets.error;
  if (sectors.error) throw sectors.error;
  if (clients.error) throw clients.error;
  if (profiles.error) throw profiles.error;

  const sectorById = new Map((sectors.data ?? []).map((s) => [s.id, mapSector(s)]));
  const clientById = new Map((clients.data ?? []).map((c) => [c.id, mapClient(c)]));
  const userById = new Map((profiles.data ?? []).map((p) => [p.id, mapUser(p)]));

  return (tickets.data ?? []).map((row) => {
    const ticket = mapTicket(row);
    return {
      ...ticket,
      requester: clientById.get(ticket.requesterId)!,
      sector: sectorById.get(ticket.sectorId)!,
      assignee: ticket.assigneeId
        ? userById.get(ticket.assigneeId) ?? null
        : null,
    };
  });
}

export async function getTicket(
  id: string,
): Promise<TicketWithRelations | null> {
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!row) return null;

  const ticket = mapTicket(row);

  const [requesterRes, sectorRes, assigneeRes] = await Promise.all([
    supabase.from("clients").select("*").eq("id", ticket.requesterId).maybeSingle(),
    supabase.from("sectors").select("*").eq("id", ticket.sectorId).maybeSingle(),
    ticket.assigneeId
      ? supabase.from("profiles").select("*").eq("id", ticket.assigneeId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  return {
    ...ticket,
    requester: requesterRes.data ? mapClient(requesterRes.data) : ({} as never),
    sector: sectorRes.data ? mapSector(sectorRes.data) : ({} as never),
    assignee: assigneeRes.data ? mapUser(assigneeRes.data) : null,
  };
}

export async function getTicketMessages(
  ticketId: string,
): Promise<TicketMessage[]> {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at");
  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const { data: authors } = await supabase
    .from("profiles")
    .select("*")
    .in("id", authorIds);

  const nameById = new Map<string, string>(
    (authors ?? []).map((a) => [a.id, mapUser(a as never).fullName]),
  );

  return rows.map((r) => mapMessage(r, nameById.get(r.author_id) ?? "Usuário"));
}
