import type { Database } from "@/types/database";
import type {
  Client,
  Sector,
  Ticket,
  TicketMessage,
  User,
} from "@/types/domain";

type Tables = Database["public"]["Tables"];

export function mapSector(row: Tables["sectors"]["Row"]): Sector {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export function mapUser(row: Tables["profiles"]["Row"]): User {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    sectorId: row.sector_id,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export function mapClient(row: Tables["clients"]["Row"]): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    authUserId: row.auth_user_id,
    createdAt: row.created_at,
  };
}

export function mapTicket(row: Tables["tickets"]["Row"]): Ticket {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    description: row.description,
    requesterId: row.requester_id,
    sectorId: row.sector_id,
    assigneeId: row.assignee_id,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    closedAt: row.closed_at,
  };
}

export function mapMessage(
  row: Tables["ticket_messages"]["Row"],
  authorName: string,
): TicketMessage {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    authorId: row.author_id,
    authorName,
    body: row.body,
    isInternal: row.is_internal,
    createdAt: row.created_at,
  };
}
