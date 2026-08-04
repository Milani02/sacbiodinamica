-- ============================================================
-- SAC Biodinâmica — remove o campo "empresa" do ticket
--
-- O grupo decidiu não usar mais o campo que marcava a qual empresa
-- (Oraltech/Biodinâmica/Injecta) um ticket se referia. Cada empresa já
-- tem seu próprio SAC hoje (sacoraltech, sacinjecta), então essa
-- distinção deixou de fazer sentido aqui dentro.
--
-- Rode no SQL Editor do Supabase. Idempotente.
-- ============================================================

alter table public.tickets
  drop column if exists company;

drop type if exists public.ticket_company;
