-- ============================================================
-- SAC Biodinâmica — empresa passa do cliente para o ticket
--
-- A migration 0012 marcava a empresa (Oraltech/Biodinâmica/Injecta) no
-- CADASTRO DO CLIENTE. Isso está errado: um mesmo cliente pode comprar
-- produtos de mais de uma empresa do grupo, então um ticket seu pode ser
-- sobre Oraltech e outro sobre Injecta. A empresa é uma característica do
-- TICKET (o atendente marca ao tratar o chamado), não do cliente.
--
-- Rode no SQL Editor do Supabase. Idempotente.
-- ============================================================

do $$
begin
  if exists (select 1 from pg_type where typname = 'client_company') then
    alter type public.client_company rename to ticket_company;
  end if;
end $$;

alter table public.tickets
  add column if not exists company public.ticket_company;

alter table public.clients
  drop column if exists company;

grant usage on type public.ticket_company to authenticated;
