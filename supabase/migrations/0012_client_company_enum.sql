-- ============================================================
-- SAC Biodinâmica — empresa do cliente (lista fixa)
--
-- `clients.company` era texto livre. O atendente passa a marcar uma das
-- 3 empresas do grupo ao cadastrar/editar um cliente; o valor aparece
-- também no relatório exportado (planilha de tickets).
--
-- Linhas existentes cujo texto livre não bate com nenhuma das 3 empresas
-- ficam com company = NULL (o atendente reclassifica na tela de clientes).
--
-- Rode no SQL Editor do Supabase. Idempotente.
-- ============================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'client_company') then
    create type public.client_company as enum ('oraltech', 'biodinamica', 'injecta');
  end if;
end $$;

alter table public.clients
  alter column company type public.client_company
  using (
    case
      when company ~* 'oraltech'   then 'oraltech'::public.client_company
      when company ~* 'biodin'     then 'biodinamica'::public.client_company
      when company ~* 'injecta'    then 'injecta'::public.client_company
      else null
    end
  );

grant usage on type public.client_company to authenticated;
