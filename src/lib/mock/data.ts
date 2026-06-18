import type {
  Client,
  Sector,
  Ticket,
  TicketMessage,
  TicketWithRelations,
  User,
} from "@/types/domain";

/**
 * Mock dataset for Fase 0 (UI shell).
 * Replaced by the Supabase data layer in Fase 1.
 */

export const sectors: Sector[] = [
  { id: "s1", name: "Suporte Técnico", description: "Problemas de produto e sistema", isActive: true, createdAt: "2026-01-10T12:00:00Z" },
  { id: "s2", name: "Financeiro", description: "Cobranças, notas e pagamentos", isActive: true, createdAt: "2026-01-10T12:00:00Z" },
  { id: "s3", name: "Comercial", description: "Vendas e relacionamento", isActive: true, createdAt: "2026-01-10T12:00:00Z" },
  { id: "s4", name: "Logística", description: "Entregas e devoluções", isActive: true, createdAt: "2026-01-10T12:00:00Z" },
];

export const users: User[] = [
  { id: "u1", fullName: "Tina Andrade", email: "tina@biodinamica.com", role: "admin", sectorId: null, isActive: true, createdAt: "2026-01-05T12:00:00Z" },
  { id: "u2", fullName: "Rafael Lima", email: "rafael@biodinamica.com", role: "agent", sectorId: "s1", isActive: true, createdAt: "2026-02-01T12:00:00Z" },
  { id: "u3", fullName: "Bruna Costa", email: "bruna@biodinamica.com", role: "agent", sectorId: "s2", isActive: true, createdAt: "2026-02-01T12:00:00Z" },
  { id: "u4", fullName: "Diego Souza", email: "diego@biodinamica.com", role: "agent", sectorId: "s4", isActive: true, createdAt: "2026-03-12T12:00:00Z" },
];

export const clients: Client[] = [
  { id: "c1", name: "Mariana Reis", email: "mariana@fazendaverde.com", phone: "(11) 98888-1010", company: "Fazenda Verde", createdAt: "2026-04-02T12:00:00Z" },
  { id: "c2", name: "João Pedro Alves", email: "joao@agrosol.com", phone: "(19) 97777-2020", company: "AgroSol", createdAt: "2026-04-10T12:00:00Z" },
  { id: "c3", name: "Camila Nunes", email: "camila@hortavida.com", phone: null, company: "Horta Vida", createdAt: "2026-05-01T12:00:00Z" },
  { id: "c4", name: "Lucas Martins", email: "lucas@terraboa.com", phone: "(31) 96666-3030", company: "Terra Boa", createdAt: "2026-05-18T12:00:00Z" },
];

export const tickets: Ticket[] = [
  { id: "t1", code: "SAC-000118", title: "Erro ao emitir segunda via de boleto", description: "Cliente não consegue gerar a segunda via do boleto no portal. A página retorna erro 500 ao clicar em 'Gerar boleto'.", requesterId: "c1", sectorId: "s2", assigneeId: "u3", status: "in_progress", priority: "high", createdAt: "2026-06-17T13:20:00Z", updatedAt: "2026-06-18T11:05:00Z", closedAt: null },
  { id: "t2", code: "SAC-000119", title: "Pedido entregue com itens faltando", description: "Pedido #4821 chegou sem 2 dos 5 itens listados na nota fiscal.", requesterId: "c2", sectorId: "s4", assigneeId: "u4", status: "open", priority: "urgent", createdAt: "2026-06-18T08:40:00Z", updatedAt: "2026-06-18T09:15:00Z", closedAt: null },
  { id: "t3", code: "SAC-000120", title: "Dúvida sobre plano de assinatura", description: "Gostaria de entender a diferença entre os planos Essencial e Pro.", requesterId: "c3", sectorId: "s3", assigneeId: null, status: "new", priority: "low", createdAt: "2026-06-18T10:02:00Z", updatedAt: "2026-06-18T10:02:00Z", closedAt: null },
  { id: "t4", code: "SAC-000121", title: "Sistema lento no horário de pico", description: "Entre 9h e 11h o painel fica muito lento para carregar relatórios.", requesterId: "c4", sectorId: "s1", assigneeId: "u2", status: "waiting_client", priority: "medium", createdAt: "2026-06-16T14:30:00Z", updatedAt: "2026-06-17T16:45:00Z", closedAt: null },
  { id: "t5", code: "SAC-000122", title: "Solicitação de nota fiscal de maio", description: "Preciso da NF referente às compras de maio para o setor contábil.", requesterId: "c1", sectorId: "s2", assigneeId: "u3", status: "resolved", priority: "medium", createdAt: "2026-06-14T09:00:00Z", updatedAt: "2026-06-15T10:20:00Z", closedAt: null },
  { id: "t6", code: "SAC-000123", title: "Falha no login com autenticação", description: "Ao tentar entrar, recebo 'credenciais inválidas' mesmo com a senha correta.", requesterId: "c2", sectorId: "s1", assigneeId: "u2", status: "open", priority: "high", createdAt: "2026-06-18T07:55:00Z", updatedAt: "2026-06-18T08:10:00Z", closedAt: null },
  { id: "t7", code: "SAC-000117", title: "Troca de produto com defeito", description: "Item recebido com avaria. Solicito troca conforme política de devolução.", requesterId: "c4", sectorId: "s4", assigneeId: "u4", status: "closed", priority: "medium", createdAt: "2026-06-10T11:00:00Z", updatedAt: "2026-06-13T17:30:00Z", closedAt: "2026-06-13T17:30:00Z" },
  { id: "t8", code: "SAC-000124", title: "Atualização de dados cadastrais", description: "Mudamos de endereço e razão social. Preciso atualizar o cadastro.", requesterId: "c3", sectorId: "s3", assigneeId: null, status: "new", priority: "low", createdAt: "2026-06-18T11:30:00Z", updatedAt: "2026-06-18T11:30:00Z", closedAt: null },
];

export const messages: TicketMessage[] = [
  { id: "m1", ticketId: "t1", authorId: "c1", authorName: "Mariana Reis", body: "Bom dia, não consigo gerar a segunda via do boleto. Aparece um erro na tela.", isInternal: false, createdAt: "2026-06-17T13:20:00Z" },
  { id: "m2", ticketId: "t1", authorId: "u3", authorName: "Bruna Costa", body: "Olá, Mariana! Já estamos verificando. Pode me informar qual navegador você está usando?", isInternal: false, createdAt: "2026-06-17T14:05:00Z" },
  { id: "m3", ticketId: "t1", authorId: "u3", authorName: "Bruna Costa", body: "Reproduzi o erro 500 no gateway de boletos. Abrir chamado com o time de pagamentos.", isInternal: true, createdAt: "2026-06-18T11:05:00Z" },
];

const sectorById = new Map(sectors.map((s) => [s.id, s]));
const userById = new Map(users.map((u) => [u.id, u]));
const clientById = new Map(clients.map((c) => [c.id, c]));

export function withRelations(ticket: Ticket): TicketWithRelations {
  return {
    ...ticket,
    requester: clientById.get(ticket.requesterId)!,
    sector: sectorById.get(ticket.sectorId)!,
    assignee: ticket.assigneeId ? userById.get(ticket.assigneeId) ?? null : null,
  };
}

export const ticketsWithRelations: TicketWithRelations[] =
  tickets.map(withRelations);

/** Current signed-in user stand-in for Fase 0. */
export const currentUser: User = users[0];
