# Supabase clients (Fase 1)

Esta pasta abriga os clients do Supabase, criados na **Fase 1** (Banco & Auth).
Estrutura planejada:

- `client.ts` — client para o browser (`createBrowserClient`).
- `server.ts` — client para Server Components / Server Actions (`createServerClient`, lê cookies).
- `middleware.ts` — refresh de sessão usado pelo `middleware.ts` raiz para proteger rotas.
- `admin.ts` — client com `service_role` (somente servidor; tarefas administrativas).

Variáveis de ambiente em `.env.local` (ver `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (somente servidor)

Enquanto a Fase 1 não chega, a aplicação roda sobre dados mockados em
`src/lib/mock/`.
