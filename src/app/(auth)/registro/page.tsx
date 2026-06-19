"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { BrandMark } from "@/components/layout/brand-mark";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("A senha deve ter ao menos 8 caracteres.");
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName.trim() } },
    });

    if (error) {
      setError(
        /already/i.test(error.message)
          ? "Já existe uma conta com este e-mail."
          : "Não foi possível criar a conta. Tente novamente.",
      );
      setLoading(false);
      return;
    }

    if (data.session) {
      // Confirmação de e-mail desativada: já entra direto.
      window.location.assign("/dashboard");
      return;
    }

    // Confirmação de e-mail ativada: aguarda o usuário confirmar.
    setConfirmSent(true);
    setLoading(false);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <BrandMark />
          </div>
          <span className="font-semibold tracking-tight">SAC Biodinâmica</span>
        </div>
        <div className="max-w-sm">
          <p className="text-2xl font-medium leading-snug tracking-tight">
            Abra um ticket em minutos.
          </p>
          <p className="mt-3 text-sm text-sidebar-foreground/70">
            Crie sua conta para registrar solicitações e conversar com a nossa
            equipe de atendimento em um só lugar.
          </p>
        </div>
        <span className="text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} Biodinâmica
        </span>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BrandMark />
            </div>
            <span className="font-semibold tracking-tight">SAC Biodinâmica</span>
          </div>

          {confirmSent ? (
            <div className="grid gap-4">
              <Alert>
                <MailCheck />
                <AlertTitle>Confirme seu e-mail</AlertTitle>
                <AlertDescription>
                  Enviamos um link de confirmação para <strong>{email}</strong>.
                  Após confirmar, faça login para acessar a central.
                </AlertDescription>
              </Alert>
              <Button asChild variant="outline">
                <Link href="/login">Ir para o login</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 grid gap-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Criar conta
                </h1>
                <p className="text-sm text-muted-foreground">
                  Registre-se como cliente para abrir e acompanhar tickets.
                </p>
              </div>

              {error ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Não foi possível criar a conta</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@empresa.com"
                      autoComplete="email"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      required
                    />
                  </Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Spinner data-icon="inline-start" /> : null}
                    Criar conta
                  </Button>
                </FieldGroup>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Entrar
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
