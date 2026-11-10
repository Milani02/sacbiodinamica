-- ============================================================
-- SAC Biodinâmica — trava de elevação de privilégio em profiles
--
-- ACHADO (validação de software, FB7.21-20): a policy "profiles_update"
-- permite ao usuário atualizar a PRÓPRIA linha; como não havia restrição
-- de coluna, um cliente autenticado conseguia gravar role='admin' (e
-- alterar is_active / sector_id) direto pela API REST do Supabase —
-- elevação de privilégio. O app não expõe isso (o formulário de /perfil
-- só envia nome e senha), mas a API aceitava.
--
-- CORREÇÃO: trigger BEFORE UPDATE que, quando quem está gravando NÃO é
-- admin, força role, is_active e sector_id a permanecerem com o valor
-- anterior. Admin continua podendo gerenciar usuários (role/setor/status)
-- normalmente, pela tela de Usuários. A atualização do próprio nome/senha
-- segue funcionando para todos.
--
-- Rode no SQL Editor do Supabase. Idempotente.
-- ============================================================

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text;
begin
  -- Admins (sessão autenticada) podem alterar perfil/status/setor de qualquer usuário.
  if public.is_admin() then
    return new;
  end if;

  -- O service_role (backend administrativo, ex.: criação de usuário em
  -- src/features/users/actions.ts) também pode. Ele não passa pela RLS, mas
  -- passa por este trigger; sem esta liberação, o createUser não conseguiria
  -- definir o papel do novo usuário.
  jwt_role := coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
  if jwt_role = 'service_role' then
    return new;
  end if;

  -- Demais usuários (cliente/atendente comum): colunas sensíveis ficam imutáveis
  -- (voltam ao valor atual), mesmo que a requisição tente alterá-las. Nome e senha
  -- não são afetados.
  new.role      := old.role;
  new.is_active := old.is_active;
  new.sector_id := old.sector_id;
  return new;
end;
$$;

revoke all on function public.protect_profile_privileges() from public, anon;

drop trigger if exists trg_protect_profile on public.profiles;
create trigger trg_protect_profile
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();
